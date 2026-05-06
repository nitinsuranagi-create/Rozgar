import json
from datetime import date

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import connection
from django.http import JsonResponse
from django.utils.dateparse import parse_date
from django.views.decorators.csrf import csrf_exempt

from .ai_service import generate_ai_job_reply
from .exam_questions import EXAM_QUESTION_COUNT, get_exam_overview, get_questions_for_domain, resolve_exam_domain
from .models import Application, Job, Profile


def _ensure_profile_location_column() -> None:
    with connection.cursor() as cursor:
        cursor.execute("PRAGMA table_info(core_profile)")
        cols = [row[1] for row in cursor.fetchall()]
        if "location" not in cols:
            cursor.execute("ALTER TABLE core_profile ADD COLUMN location varchar(120) NOT NULL DEFAULT ''")


def _user_payload(user: User) -> dict:
    profile = user.profile
    dob_value = profile.dob
    if isinstance(dob_value, str):
        dob_value = parse_date(dob_value)

    return {
        "id": str(user.id),
        "name": user.first_name or user.username,
        "email": user.email,
        "role": profile.role,
        "location": profile.location,
        "age": profile.age,
        "dob": dob_value.isoformat() if isinstance(dob_value, date) else "",
        "experience": profile.experience,
        "skills": profile.skills or [],
    }


def _job_payload(job: Job) -> dict:
    return {
        "id": str(job.id),
        "title": job.title,
        "category": job.category,
        "location": job.location,
        "pay": job.pay,
        "type": job.type,
        "postedBy": job.posted_by,
        "postedAt": job.created_at.isoformat(),
        "description": job.description,
        "skills": job.skills or [],
        "applicants": job.applicants,
        "trending": job.trending,
    }


def _application_payload(application: Application) -> dict:
    return {
        "id": str(application.id),
        "jobId": str(application.job_id),
        "jobTitle": application.job.title,
        "userId": application.user_id,
        "userName": application.user_name,
        "userEmail": application.user_email,
        "userRole": application.user_role,
        "userAge": application.user_age,
        "userDob": application.user_dob,
        "userExperience": application.user_experience,
        "userSkills": application.user_skills or [],
        "phone": application.phone,
        "village": application.village,
        "note": application.note,
        "status": application.status,
        "score": application.score,
        "appliedAt": application.created_at.isoformat(),
    }


def _parse_json(request):
    try:
        return json.loads(request.body.decode("utf-8")), None
    except json.JSONDecodeError:
        return None, JsonResponse({"message": "Invalid JSON payload"}, status=400)


@csrf_exempt
def signup_view(request):
    if request.method != "POST":
        return JsonResponse({"message": "Method not allowed"}, status=405)

    data, error_response = _parse_json(request)
    if error_response:
        return error_response

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = data.get("role") or "user"
    location = (data.get("location") or "").strip()

    if not name or not email or not password:
        return JsonResponse({"message": "name, email and password are required"}, status=400)

    if User.objects.filter(username=email).exists():
        return JsonResponse({"message": "Account already exists with this email"}, status=409)

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=name,
    )

    dob_raw = data.get("dob")
    parsed_dob = parse_date(dob_raw) if dob_raw else None

    # Safety net for environments where latest migration wasn't applied yet.
    _ensure_profile_location_column()

    profile = Profile.objects.create(
        user=user,
        role=role if role in {"user", "admin"} else "user",
        location=location,
        age=data.get("age"),
        dob=parsed_dob,
        experience=data.get("experience") or "",
        skills=data.get("skills") or [],
        is_logged_in=True,
    )

    return JsonResponse({"user": _user_payload(user), "message": "Signup successful"}, status=201)


@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"message": "Method not allowed"}, status=405)

    data, error_response = _parse_json(request)
    if error_response:
        return error_response

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = data.get("role")

    if not email or not password:
        return JsonResponse({"message": "email and password are required"}, status=400)

    user = authenticate(username=email, password=password)
    if not user:
        return JsonResponse({"message": "Invalid email or password"}, status=401)

    try:
        profile = user.profile
    except Profile.DoesNotExist:
        profile = Profile.objects.create(user=user, role="user")

    if role and profile.role != role:
        return JsonResponse({"message": "Role does not match this account"}, status=403)

    profile.is_logged_in = True
    profile.save(update_fields=["is_logged_in"])

    return JsonResponse({"user": _user_payload(user), "message": "Login successful"}, status=200)


@csrf_exempt
def logout_view(request):
    if request.method != "POST":
        return JsonResponse({"message": "Method not allowed"}, status=405)

    data, error_response = _parse_json(request)
    if error_response:
        return error_response

    email = (data.get("email") or "").strip().lower()
    if not email:
        return JsonResponse({"message": "email is required"}, status=400)

    try:
        user = User.objects.get(username=email)
    except User.DoesNotExist:
        return JsonResponse({"message": "User not found"}, status=404)

    profile, _ = Profile.objects.get_or_create(user=user, defaults={"role": "user"})
    profile.is_logged_in = False
    profile.save(update_fields=["is_logged_in"])
    return JsonResponse({"message": "Logout successful"}, status=200)


def active_workers_count_view(request):
    if request.method != "GET":
        return JsonResponse({"message": "Method not allowed"}, status=405)

    count = Profile.objects.filter(role="user", is_logged_in=True).count()
    return JsonResponse({"count": count}, status=200)


@csrf_exempt
def jobs_view(request):
    if request.method == "GET":
        jobs = Job.objects.all()
        return JsonResponse({"jobs": [_job_payload(job) for job in jobs]}, status=200)

    if request.method == "POST":
        data, error_response = _parse_json(request)
        if error_response:
            return error_response

        title = (data.get("title") or "").strip()
        category = (data.get("category") or "").strip()
        if not title or not category:
            return JsonResponse({"message": "title and category are required"}, status=400)

        job = Job.objects.create(
            title=title,
            category=category,
            location=(data.get("location") or "").strip(),
            pay=(data.get("pay") or "").strip(),
            type=(data.get("type") or "Full-time"),
            posted_by=(data.get("postedBy") or "Admin").strip(),
            description=(data.get("description") or "").strip(),
            skills=data.get("skills") or [category],
            applicants=int(data.get("applicants") or 0),
            trending=bool(data.get("trending") or False),
        )

        return JsonResponse({"job": _job_payload(job), "message": "Job posted"}, status=201)

    return JsonResponse({"message": "Method not allowed"}, status=405)


@csrf_exempt
def applications_view(request):
    if request.method == "GET":
        applications = Application.objects.select_related("job").all()
        return JsonResponse({"applications": [_application_payload(app) for app in applications]}, status=200)

    if request.method == "POST":
        data, error_response = _parse_json(request)
        if error_response:
            return error_response

        job_id = data.get("jobId")
        user_id = (data.get("userId") or "").strip()
        user_name = (data.get("userName") or "").strip()
        user_email = (data.get("userEmail") or "").strip().lower()
        user_role = (data.get("userRole") or "user").strip()
        if not job_id or not user_id or not user_name or not user_email:
            return JsonResponse({"message": "jobId and user details are required"}, status=400)

        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return JsonResponse({"message": "Job not found"}, status=404)

        duplicate = Application.objects.filter(job_id=job_id, user_id=user_id).exists()
        if duplicate:
            return JsonResponse({"message": "You have already applied for this job"}, status=409)

        application = Application.objects.create(
            job=job,
            user_id=user_id,
            user_name=user_name,
            user_email=user_email,
            user_role=user_role,
            user_age=data.get("userAge"),
            user_dob=(data.get("userDob") or "").strip(),
            user_experience=(data.get("userExperience") or "").strip(),
            user_skills=data.get("userSkills") or [],
            phone=(data.get("phone") or "").strip(),
            village=(data.get("village") or "").strip(),
            note=(data.get("note") or "").strip(),
            status="Pending",
        )
        job.applicants = job.applicants + 1
        job.save(update_fields=["applicants"])
        return JsonResponse({"application": _application_payload(application), "message": "Applied successfully"}, status=201)

    return JsonResponse({"message": "Method not allowed"}, status=405)


@csrf_exempt
def application_decision_view(request, application_id):
    if request.method != "PATCH":
        return JsonResponse({"message": "Method not allowed"}, status=405)

    payload, error_response = _parse_json(request)
    if error_response:
        return error_response

    status = payload.get("status")
    if status not in {"Accepted", "Rejected"}:
        return JsonResponse({"message": "status must be Accepted or Rejected"}, status=400)

    try:
        application = Application.objects.select_related("job").get(id=application_id)
    except Application.DoesNotExist:
        return JsonResponse({"message": "Application not found"}, status=404)

    application.status = status
    application.save(update_fields=["status"])
    return JsonResponse({"application": _application_payload(application), "message": "Application updated"}, status=200)


@csrf_exempt
def exam_questions_view(request):
    if request.method != "GET":
        return JsonResponse({"message": "Method not allowed"}, status=405)

    skill = (request.GET.get("skill") or request.GET.get("category") or "").strip()
    job_category = (request.GET.get("jobCategory") or "").strip()
    skills_raw = (request.GET.get("jobSkills") or "").strip()
    job_skills = [s.strip() for s in skills_raw.split(",") if s.strip()]

    domain = resolve_exam_domain(skill, job_category, job_skills)
    questions = get_questions_for_domain(domain)

    return JsonResponse(
        {
            "domain": domain,
            "questionsPerExam": EXAM_QUESTION_COUNT,
            "questionCount": len(questions),
            "questions": questions,
        },
        status=200,
    )


def exam_overview_view(request):
    if request.method != "GET":
        return JsonResponse({"message": "Method not allowed"}, status=405)
    return JsonResponse(get_exam_overview(), status=200)


@csrf_exempt
def application_exam_submit_view(request, application_id):
    if request.method != "PATCH":
        return JsonResponse({"message": "Method not allowed"}, status=405)

    payload, error_response = _parse_json(request)
    if error_response:
        return error_response

    try:
        application = Application.objects.select_related("job").get(id=application_id)
    except Application.DoesNotExist:
        return JsonResponse({"message": "Application not found"}, status=404)

    score = payload.get("score")
    if score is None:
        return JsonResponse({"message": "score is required"}, status=400)

    try:
        score_value = int(score)
    except (TypeError, ValueError):
        return JsonResponse({"message": "score must be a number"}, status=400)

    score_value = max(0, min(100, score_value))
    passed = bool(payload.get("pass"))
    application.score = score_value
    application.status = "Pass" if passed else "Fail"
    application.save(update_fields=["score", "status"])
    return JsonResponse({"application": _application_payload(application), "message": "Exam submitted"}, status=200)


@csrf_exempt
def ai_chat_view(request):
    if request.method != "POST":
        return JsonResponse({"message": "Method not allowed"}, status=405)

    data, error_response = _parse_json(request)
    if error_response:
        return error_response

    message = (data.get("message") or "").strip()
    if not message:
        return JsonResponse({"message": "message is required"}, status=400)

    user_payload = data.get("user") or {}
    user_id = user_payload.get("id") or data.get("userId")

    if user_id:
        try:
            db_user = User.objects.select_related("profile").get(id=user_id)
            user_payload = _user_payload(db_user)
        except User.DoesNotExist:
            pass

    jobs = [_job_payload(job) for job in Job.objects.all()]
    result = generate_ai_job_reply(user_payload, message, jobs)
    return JsonResponse(result, status=200)
