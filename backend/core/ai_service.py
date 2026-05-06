import math
import os
import re
from typing import Any

try:
    import google.generativeai as genai
except ImportError:  # pragma: no cover - handled by runtime fallback.
    genai = None

FREE_MODELS = [
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
]

# Basic synonyms to interpret user queries (English + common shorthand).
SKILL_SYNONYMS: dict[str, list[str]] = {
    "dairy": ["dairy", "milk", "cow", "buffalo", "milking"],
    "farming": ["farm", "farming", "agri", "agriculture", "harvest", "wheat", "paddy", "tractor"],
    "masonry": ["mason", "mistri", "raj mistri", "construction", "brick", "plaster"],
    "plumbing": ["plumb", "plumber", "pipe", "fitting"],
    "electrical": ["electric", "electrician", "wiring", "solar"],
    "tailoring": ["tailor", "tailoring", "darji", "stitch"],
    "driving": ["driver", "driving", "tractor driver"],
    "carpentry": ["carpenter", "carpentry", "wood", "woodwork"],
    "fisheries": ["fish", "fishing", "fisheries"],
    "animal care": ["animal", "cattle", "goat", "poultry", "care"],
}

# Fallback coordinates (major cities/states commonly present in this app data).
LOCATION_COORDS = {
    "andhra pradesh": (15.9129, 79.74),
    "bihar": (25.0961, 85.3131),
    "gujarat": (22.2587, 71.1924),
    "haryana": (29.0588, 76.0856),
    "himachal pradesh": (31.1048, 77.1734),
    "jharkhand": (23.6102, 85.2799),
    "kerala": (10.8505, 76.2711),
    "madhya pradesh": (22.9734, 78.6569),
    "maharashtra": (19.7515, 75.7139),
    "odisha": (20.9517, 85.0985),
    "punjab": (31.1471, 75.3412),
    "rajasthan": (27.0238, 74.2179),
    "tamil nadu": (11.1271, 78.6569),
    "uttar pradesh": (26.8467, 80.9462),
    "uttarakhand": (30.0668, 79.0193),
    "west bengal": (22.9868, 87.8550),
}


def _norm(text: str) -> str:
    return (text or "").strip().lower()

def _parse_money(value: str) -> int | None:
    """
    Extract integer rupee amount from strings like '₹12,000', '12000', '1000/day'.
    """
    if value is None:
        return None
    s = str(value)
    digits = re.findall(r"\d+", s.replace(",", ""))
    if not digits:
        return None
    try:
        return int("".join(digits))
    except ValueError:
        return None


def pay_to_daily_inr(pay: str) -> int | None:
    """
    Convert job pay string to an approximate daily INR value.
    Examples:
      '₹600/day' -> 600
      '₹12,000/mo' -> 400 (approx /30)
      '1000/day' -> 1000
    """
    p = _norm(pay)
    amount = _parse_money(p)
    if amount is None:
        return None
    if "/day" in p or "per day" in p or "daily" in p:
        return amount
    if "/mo" in p or "/month" in p or "per month" in p or "monthly" in p:
        return max(1, round(amount / 30))
    # Unknown period: keep as-is (assume daily) to avoid hiding jobs.
    return amount


def _haversine_km(a: tuple[float, float], b: tuple[float, float]) -> float:
    lat1, lon1 = a
    lat2, lon2 = b
    r = 6371.0
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    lat1 = math.radians(lat1)
    lat2 = math.radians(lat2)
    h = math.sin(d_lat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(d_lon / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def _extract_coords(location: str) -> tuple[float, float] | None:
    text = _norm(location)
    if not text:
        return None
    for key, coords in LOCATION_COORDS.items():
        if key in text or text in key:
            return coords
    return None


def estimate_distance_km(user_location: str, job_location: str) -> float | None:
    a = _extract_coords(user_location)
    b = _extract_coords(job_location)
    if not a or not b:
        return None
    return _haversine_km(a, b)


def rank_jobs_for_user(user: dict[str, Any], jobs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    user_location = _norm(user.get("location", ""))
    user_skills = [_norm(s) for s in user.get("skills", []) if _norm(s)]

    ranked: list[dict[str, Any]] = []
    for job in jobs:
        title = _norm(job.get("title", ""))
        category = _norm(job.get("category", ""))
        location = _norm(job.get("location", ""))
        job_skills = [_norm(s) for s in job.get("skills", []) if _norm(s)]

        location_match = int(bool(user_location) and (user_location in location or location in user_location))
        skill_match_count = 0
        for skill in user_skills:
            if any(skill in js or js in skill for js in job_skills) or skill in title or skill in category:
                skill_match_count += 1

        score = (location_match * 3) + (skill_match_count * 2) + (1 if (job.get("applicants", 0) or 0) > 0 else 0)
        ranked.append(
            {
                **job,
                "matchScore": score,
                "locationMatch": location_match > 0,
                "skillMatchCount": skill_match_count,
            }
        )

    ranked.sort(key=lambda j: (j["matchScore"], j.get("applicants", 0)), reverse=True)
    return ranked


def _extract_query_terms(query: str) -> dict[str, Any]:
    q = _norm(query)
    only_mode = any(phrase in q for phrase in ["only ", "just ", "sirf ", "only-", "only:", "only."])

    matched_focus: set[str] = set()
    for canonical, keys in SKILL_SYNONYMS.items():
        if any(k in q for k in keys):
            matched_focus.add(canonical)

    wants_distance = any(k in q for k in ["distance", "far", "near", "km", "kilometer", "kilometre"])

    # "skill matching jobs" intent.
    wants_strict_match = any(k in q for k in ["match my skill", "matching skill", "skill matching", "only matching", "best match"])

    # Pay filters (daily INR normalized; monthly is converted to approx daily).
    pay_min = None
    pay_max = None
    pay_exact = None

    # Patterns like: min 500 max 1000
    m = re.search(r"\bmin(?:imum)?\s*(\d[\d,]*)\b", q)
    if m:
        pay_min = _parse_money(m.group(1))
    m = re.search(r"\bmax(?:imum)?\s*(\d[\d,]*)\b", q)
    if m:
        pay_max = _parse_money(m.group(1))

    # Patterns like: between 500 and 1000 / 500 to 1000
    m = re.search(r"\bbetween\s*(\d[\d,]*)\s*(?:and|to)\s*(\d[\d,]*)\b", q)
    if m:
        pay_min = _parse_money(m.group(1))
        pay_max = _parse_money(m.group(2))
    m = re.search(r"\b(\d[\d,]*)\s*(?:to|-)\s*(\d[\d,]*)\b", q)
    if m and (pay_min is None and pay_max is None):
        pay_min = _parse_money(m.group(1))
        pay_max = _parse_money(m.group(2))

    # Patterns like: "500 pay" / "pay 500" / "salary 500"
    m = re.search(r"\b(?:pay|salary|wage|wages)\s*(?:of\s*)?(\d[\d,]*)\b", q)
    if m:
        pay_exact = _parse_money(m.group(1))
    if pay_exact is None:
        m = re.search(r"\b(\d[\d,]*)\s*(?:pay|salary|wage|wages)\b", q)
        if m:
            pay_exact = _parse_money(m.group(1))

    return {
        "only_mode": only_mode,
        "focus_skills": sorted(matched_focus),
        "wants_distance": wants_distance,
        "wants_strict_match": wants_strict_match,
        "pay_min": pay_min,
        "pay_max": pay_max,
        "pay_exact": pay_exact,
    }


def filter_ranked_jobs_for_query(
    user: dict[str, Any], query: str, ranked_jobs: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    terms = _extract_query_terms(query)
    focus = set(terms["focus_skills"])
    only_mode = terms["only_mode"]
    strict = terms["wants_strict_match"]

    if not focus and not strict and not only_mode:
        return ranked_jobs

    def job_matches_focus(job: dict[str, Any]) -> bool:
        title = _norm(job.get("title", ""))
        category = _norm(job.get("category", ""))
        skills = [_norm(s) for s in job.get("skills", []) if _norm(s)]
        for canonical in focus:
            keys = SKILL_SYNONYMS.get(canonical, [canonical])
            if any(k in title or k in category for k in keys):
                return True
            if any(any(k in js for k in keys) for js in skills):
                return True
        return False

    filtered = ranked_jobs

    # Pay filtering first (so "only" applies to already pay-filtered set)
    if terms["pay_exact"] is not None:
        target = int(terms["pay_exact"])
        tmp = []
        for j in filtered:
            daily = pay_to_daily_inr(j.get("pay", ""))
            if daily is None:
                continue
            if abs(daily - target) <= 10:
                tmp.append(j)
        filtered = tmp
    else:
        if terms["pay_min"] is not None:
            mn = int(terms["pay_min"])
            tmp = []
            for j in filtered:
                daily = pay_to_daily_inr(j.get("pay", ""))
                if daily is None:
                    continue
                if daily >= mn:
                    tmp.append(j)
            filtered = tmp
        if terms["pay_max"] is not None:
            mx = int(terms["pay_max"])
            tmp = []
            for j in filtered:
                daily = pay_to_daily_inr(j.get("pay", ""))
                if daily is None:
                    continue
                if daily <= mx:
                    tmp.append(j)
            filtered = tmp

    if focus:
        filtered = [j for j in filtered if job_matches_focus(j)]

    if strict or only_mode:
        # If strict matching requested, exclude general matches.
        # If "only" requested, keep only the focused category if provided;
        # otherwise keep only high-confidence matches (location or skill match).
        if focus:
            pass
        else:
            filtered = [j for j in filtered if j.get("locationMatch") or (j.get("skillMatchCount", 0) > 0)]

    return filtered


def _extract_location_filter(query: str, jobs: list[dict[str, Any]]) -> str | None:
    """
    Try to detect a place name present in the query by matching against existing job locations.
    This keeps things lightweight (no geocoding) but works well with your dataset.
    """
    q = _norm(query)
    if not q:
        return None

    candidates: set[str] = set()
    for j in jobs:
        loc = _norm(j.get("location", ""))
        if not loc:
            continue
        # split by separators to get place-ish tokens
        for part in [p.strip() for p in loc.replace("/", ",").split(",")]:
            if len(part) < 3:
                continue
            candidates.add(part)

    # Prefer explicit "in <place>" patterns
    if " in " in q:
        after = q.split(" in ", 1)[1].strip()
        # take first chunk before punctuation
        after = after.split("?")[0].split(".")[0].split("!")[0].strip()
        for cand in sorted(candidates, key=len, reverse=True):
            if cand and cand in after:
                return cand

    # Otherwise match any candidate substring in the query (longest wins).
    for cand in sorted(candidates, key=len, reverse=True):
        if cand and cand in q:
            return cand
    return None


def _is_location_query(query: str) -> bool:
    q = _norm(query)
    return any(k in q for k in ["jobs in", "in ", "near ", "at ", "available in", "available at"])


def _distance_candidate(query: str, jobs: list[dict[str, Any]]) -> dict[str, Any] | None:
    q = _norm(query)
    if "distance" not in q and "far" not in q and "near" not in q:
        return None
    for job in jobs:
        title = _norm(job.get("title", ""))
        location = _norm(job.get("location", ""))
        if title and title in q:
            return job
        if location and location in q:
            return job
    return jobs[0] if jobs else None


def _build_prompt(user: dict[str, Any], query: str, ranked_jobs: list[dict[str, Any]], distance_note: str | None) -> str:
    top_jobs = ranked_jobs[:5]
    jobs_blob = "\n".join(
        [
            f"- {j.get('title')} | {j.get('location')} | {j.get('pay')} | skills={j.get('skills')} | applicants={j.get('applicants')} | matchScore={j.get('matchScore')}"
            for j in top_jobs
        ]
    )
    return (
        "You are Saathi AI, a practical rural job assistant.\n"
        "Answer in simple, helpful language with concrete job suggestions.\n"
        "Respect constraints like 'only dairy jobs' or 'only skill-matching jobs'.\n"
        "Prioritize skill + location matching jobs and mention wages.\n"
        "If user asks distance, use the given distance note exactly; if not available, say distance unavailable.\n\n"
        f"User profile: location={user.get('location', '')}, skills={user.get('skills', [])}\n"
        f"User query: {query}\n"
        f"Distance note: {distance_note or 'N/A'}\n"
        f"Top matching jobs:\n{jobs_blob}\n\n"
        "Output style:\n"
        "1) One-line understanding\n"
        "2) 3-5 best jobs with location + pay + why matched\n"
        "3) One next step for user\n"
    )


def _call_gemini(prompt: str) -> str | None:
    if genai is None:
        return None
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        return None
    genai.configure(api_key=api_key)
    for model_name in FREE_MODELS:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            text = (response.text or "").strip()
            if text:
                return text
        except Exception:
            continue
    return None


def fallback_reply(user: dict[str, Any], query: str, ranked_jobs: list[dict[str, Any]], distance_note: str | None) -> str:
    terms = _extract_query_terms(query)
    top = ranked_jobs[:4] if not terms["only_mode"] else ranked_jobs[:6]
    header = "I checked live jobs using your skills and location."
    filters: list[str] = []
    if terms.get("pay_exact") is not None:
        filters.append(f"pay ≈ ₹{terms['pay_exact']}/day")
    elif terms.get("pay_min") is not None or terms.get("pay_max") is not None:
        lo = terms.get("pay_min")
        hi = terms.get("pay_max")
        if lo is not None and hi is not None:
            filters.append(f"pay ₹{lo}–₹{hi}/day")
        elif lo is not None:
            filters.append(f"pay ≥ ₹{lo}/day")
        elif hi is not None:
            filters.append(f"pay ≤ ₹{hi}/day")
    if terms.get("focus_skills"):
        filters.append(f"skill/category: {', '.join(terms['focus_skills'])}")

    if filters:
        header += f" (Filters: {', '.join(filters)} | matches: {len(ranked_jobs)})"

    lines = [header, ""]
    if top:
        for idx, job in enumerate(top, start=1):
            reason_bits = []
            if job.get("locationMatch"):
                reason_bits.append("location match")
            if job.get("skillMatchCount", 0) > 0:
                reason_bits.append(f"{job['skillMatchCount']} skill match")
            reason = ", ".join(reason_bits) if reason_bits else "general match"
            lines.append(f"{idx}. {job.get('title')} - {job.get('location')} - {job.get('pay')} ({reason})")
    else:
        lines.append("No strong matches found yet. Try adding more skills in your profile.")

    if terms["wants_distance"] and distance_note:
        lines.extend(["", distance_note])
    return "\n".join(lines)


def generate_ai_job_reply(user: dict[str, Any], query: str, jobs: list[dict[str, Any]]) -> dict[str, Any]:
    ranked_all = rank_jobs_for_user(user, jobs)
    terms = _extract_query_terms(query)

    # Location-based filtering (when user asks with a place name).
    loc_filter = _extract_location_filter(query, ranked_all) if _is_location_query(query) else None
    loc_filtered = ranked_all
    if loc_filter:
        loc_filtered = [j for j in ranked_all if loc_filter in _norm(j.get("location", ""))]

    # Skill/category filtering (when user asks "only dairy", "tailor jobs", etc.)
    ranked = filter_ranked_jobs_for_query(user, query, loc_filtered)

    # If user explicitly asked for a category/skill or a location, do NOT fall back to all jobs.
    explicitly_filtered = (
        bool(terms["focus_skills"])
        or bool(loc_filter)
        or terms["only_mode"]
        or terms["wants_strict_match"]
        or (terms["pay_exact"] is not None or terms["pay_min"] is not None or terms["pay_max"] is not None)
    )
    if explicitly_filtered and not ranked:
        reason_bits: list[str] = []
        if terms["focus_skills"]:
            reason_bits.append(f"your requested skill/category ({', '.join(terms['focus_skills'])})")
        if loc_filter:
            reason_bits.append(f"location ({loc_filter})")
        if terms["pay_exact"] is not None:
            reason_bits.append(f"pay around ₹{terms['pay_exact']}/day")
        elif terms["pay_min"] is not None or terms["pay_max"] is not None:
            reason_bits.append(
                "pay range "
                + (
                    f"₹{terms['pay_min'] or 0}–₹{terms['pay_max'] or 'any'}/day"
                )
            )
        reason = " and ".join(reason_bits) if reason_bits else "your request"
        reply = f"No jobs available for {reason} right now. Try another skill or location."
        return {
            "reply": reply,
            "recommendedJobs": [],
            "distanceNote": None,
            "usedModel": "fallback",
        }

    candidate = _distance_candidate(query, ranked)
    distance_note = None
    if candidate and user.get("location"):
        km = estimate_distance_km(user.get("location", ""), candidate.get("location", ""))
        if km is None:
            distance_note = (
                f"I could not calculate exact distance between {user.get('location')} and {candidate.get('location')} "
                "because one of the locations is too generic."
            )
        else:
            distance_note = (
                f"Estimated distance between {user.get('location')} and {candidate.get('location')} is about {round(km)} km "
                "(straight-line estimate)."
            )

    # IMPORTANT:
    # If user asked with explicit constraints (pay/location/only skill), we MUST answer strictly from filtered jobs.
    # Gemini may hallucinate or list other jobs, so in these cases we return deterministic output.
    if explicitly_filtered:
        reply = fallback_reply(user, query, ranked, distance_note)
        used = "fallback"
    else:
        prompt = _build_prompt(user, query, ranked, distance_note)
        ai_text = _call_gemini(prompt)
        reply = ai_text or fallback_reply(user, query, ranked, distance_note)
        used = "gemini" if ai_text else "fallback"
    return {
        "reply": reply,
        "recommendedJobs": ranked[:6],
        "distanceNote": distance_note,
        "usedModel": used,
    }
