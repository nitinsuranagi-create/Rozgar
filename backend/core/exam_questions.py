"""
Skill exams: exactly EXAM_QUESTION_COUNT MCQs per domain.
Domains align with signup skills + sensible job-category fallbacks.
"""

from __future__ import annotations

EXAM_QUESTION_COUNT = 10

# Each list MUST contain exactly EXAM_QUESTION_COUNT items.
QUESTION_BANK: dict[str, list[dict]] = {
    "farming": [
        {"id": "farm_1", "question": "Before sowing, treating seeds helps mainly to?", "options": ["Increase stone content", "Reduce disease/pests and improve germination", "Remove soil", "Delay rain"], "correct": 1, "category": "Farming"},
        {"id": "farm_2", "question": "Soil pH that suits most field crops in India is roughly?", "options": ["3–4 (very acidic)", "6.0–7.5 (slightly acidic to neutral)", "9–10 (strongly alkaline)", "Any pH is fine"], "correct": 1, "category": "Farming"},
        {"id": "farm_3", "question": "Composting farm waste mainly improves?", "options": ["Soil organic matter and structure", "Concrete strength", "Fuel octane", "Water salinity"], "correct": 0, "category": "Farming"},
        {"id": "farm_4", "question": "Irrigation scheduling should mainly follow?", "options": ["Random flooding only", "Crop stage + soil moisture + weather", "Moon phase only", "Neighbor gossip"], "correct": 1, "category": "Farming"},
        {"id": "farm_5", "question": "Integrated Pest Management (IPM) prefers?", "options": ["Only daily heavy spraying", "Monitoring + cultural + biological + careful chemical use", "Ignoring pests", "Burning entire field"], "correct": 1, "category": "Farming"},
        {"id": "farm_6", "question": "Crop rotation helps reduce?", "options": ["Soil depth", "Build-up of pests/diseases and nutrient imbalance", "Sunlight", "Seed size"], "correct": 1, "category": "Farming"},
        {"id": "farm_7", "question": "Harvesting at correct maturity mainly affects?", "options": ["Only color of tools", "Grain quality, yield, and storability", "House paint", "Tractor brand"], "correct": 1, "category": "Farming"},
        {"id": "farm_8", "question": "Green manure crops are grown mainly to?", "options": ["Sell as jewelry", "Fix nitrogen / add biomass and improve soil", "Block roads", "Replace water"], "correct": 1, "category": "Farming"},
        {"id": "farm_9", "question": "Safe storage of grains needs?", "options": ["High moisture and closed bags", "Cleaning, drying, pest-proof bins, and monitoring", "Open wet heaps", "Mixing with cement"], "correct": 1, "category": "Farming"},
        {"id": "farm_10", "question": "Contour bunding on slopes mainly reduces?", "options": ["Soil erosion and runoff", "Tractor speed only", "Rain formation", "Seed germination always"], "correct": 0, "category": "Farming"},
    ],
    "dairy": [
        {"id": "dairy_1", "question": "First milk after calving (colostrum) should be?", "options": ["Discarded always", "Fed to calf early for immunity", "Given to dogs only", "Frozen for one year"], "correct": 1, "category": "Dairy"},
        {"id": "dairy_2", "question": "Mastitis risk increases most when?", "options": ["Teat hygiene is poor and milking is irregular", "Cows drink clean water", "Shed is ventilated", "Milking machine cups fit well"], "correct": 0, "category": "Dairy"},
        {"id": "dairy_3", "question": "Milk should be cooled quickly mainly to?", "options": ["Improve bacterial growth", "Slow spoilage and keep quality", "Change milk color to blue", "Remove fat"], "correct": 1, "category": "Dairy"},
        {"id": "dairy_4", "question": "Loose housing with clean bedding helps?", "options": ["Increase lameness and disease", "Comfort, udder health, and cleanliness", "Remove need for water", "Eliminate feeding"], "correct": 1, "category": "Dairy"},
        {"id": "dairy_5", "question": "Balanced ration for milch animals should match?", "options": ["Only taste of straw", "Body weight, milk yield, stage of lactation, and forage quality", "TV ads only", "Random guess"], "correct": 1, "category": "Dairy"},
        {"id": "dairy_6", "question": "Recording daily milk yield per animal helps?", "options": ["Detect health and feeding issues early", "Paint the shed", "Reduce water intake", "Stop vaccination"], "correct": 0, "category": "Dairy"},
        {"id": "dairy_7", "question": "Deworming schedule should be?", "options": ["Never", "Based on local parasite risk and vet advice", "Only during festivals", "Daily with kerosene"], "correct": 1, "category": "Dairy"},
        {"id": "dairy_8", "question": "Electric fencing for paddocks must be?", "options": ["Installed safely with grounding and signs", "Left bare high-voltage near children", "Connected to house mains randomly", "Ignored"], "correct": 0, "category": "Dairy"},
        {"id": "dairy_9", "question": "Calf weaning should be?", "options": ["Abrupt at birth", "Gradual with good starter feed and growth checks", "Never feed calf", "Only grass from day 1"], "correct": 1, "category": "Dairy"},
        {"id": "dairy_10", "question": "Milk adulteration detection at collection point often uses?", "options": ["Only smell of petrol", "Density/clot-on-boil tests and lab strips where available", "Coin toss", "Loud music"], "correct": 1, "category": "Dairy"},
    ],
    "masonry": [
        {"id": "mas_1", "question": "Mortar joints should be?", "options": ["Fully dry before curing", "Too thin to save sand", "Filled full and tooled consistently", "Left hollow for speed"], "correct": 2, "category": "Masonry"},
        {"id": "mas_2", "question": "Curing new masonry means?", "options": ["Keeping it wet for strength gain", "Heating with blowtorch immediately", "Painting same day always", "No water for a week"], "correct": 0, "category": "Masonry"},
        {"id": "mas_3", "question": "Scaffolding planks must?", "options": ["Overhang dangerously", "Be secured, tied, and inspected", "Be single brick thick", "Float in air"], "correct": 1, "category": "Masonry"},
        {"id": "mas_4", "question": "Concrete mix water should be?", "options": ["As little as workable for strength", "Flooded until soup", "Only oil", "Random"], "correct": 0, "category": "Masonry"},
        {"id": "mas_5", "question": "Chisel use on stone/brick should aim at?", "options": ["Eyes unprotected", "Controlled strikes away from body with PPE", "Hitting electrical wires", "Crowd standing close"], "correct": 1, "category": "Masonry"},
        {"id": "mas_6", "question": "Damp-proof course (DPC) prevents?", "options": ["Rising damp into walls", "Bird songs", "Paint drying", "Tool theft only"], "correct": 0, "category": "Masonry"},
        {"id": "mas_7", "question": "Column starter bars should be?", "options": ["Bent randomly", "Aligned, lapped, and tied per drawing", "Cut flush always", "Left outside concrete"], "correct": 1, "category": "Masonry"},
        {"id": "mas_8", "question": "Lintel over openings carries load to?", "options": ["Side jambs/walls", "Only glass", "Sky directly", "Nothing"], "correct": 0, "category": "Masonry"},
        {"id": "mas_9", "question": "Work at height: guardrails are for?", "options": ["Decoration only", "Preventing falls", "Hanging clothes", "Storing bricks only"], "correct": 1, "category": "Masonry"},
        {"id": "mas_10", "question": "Brick frog (indent) should usually face?", "options": ["Up to fill with mortar", "Down always for speed", "Sideways only", "Outward to street only"], "correct": 0, "category": "Masonry"},
    ],
    "plumbing": [
        {"id": "plumb_1", "question": "Threaded joints need?", "options": ["PTFE tape/paste and firm tightening without over-torque", "Glue only on steel", "No seal", "Hammer only"], "correct": 0, "category": "Plumbing"},
        {"id": "plumb_2", "question": "Water hammer can be reduced by?", "options": ["Fast-closing valves only", "Air chambers / arrestors and controlled valve closure", "Removing all pipes", "Smaller pumps always"], "correct": 1, "category": "Plumbing"},
        {"id": "plumb_3", "question": "Drain slope is for?", "options": ["Looks", "Gravity flow and self-cleaning velocity", "Heating pipes", "Noise only"], "correct": 1, "category": "Plumbing"},
        {"id": "plumb_4", "question": "PVC solvent welding needs?", "options": ["Clean, deburr, primer/cement per spec, and hold set time", "Dusty pipes only", "Cold water on joint instantly", "No measure"], "correct": 0, "category": "Plumbing"},
        {"id": "plumb_5", "question": "Main shut-off valve location should be?", "options": ["Unknown to everyone", "Known and accessible for emergencies", "Behind concrete", "Removed"], "correct": 1, "category": "Plumbing"},
        {"id": "plumb_6", "question": "Leak test on new lines often uses?", "options": ["Pressure test with gauge and soap bubble check", "Guessing", "Painting", "Singing"], "correct": 0, "category": "Plumbing"},
        {"id": "plumb_7", "question": "Trap under sink prevents?", "options": ["Sewer gases entering room", "Water use", "Drain flow", "Tap finish"], "correct": 0, "category": "Plumbing"},
        {"id": "plumb_8", "question": "Expansion in hot water lines needs?", "options": ["Loops or compensators where required", "Rigid fix everywhere", "No supports", "Wooden plugs only"], "correct": 0, "category": "Plumbing"},
        {"id": "plumb_9", "question": "Pump cavitation sound means?", "options": ["NPSH/suction issue or air entry — check strainer/priming", "Perfect operation", "Too much paint", "Happy motor"], "correct": 0, "category": "Plumbing"},
        {"id": "plumb_10", "question": "Backflow preventer protects?", "options": ["Potable water from contamination", "Only meters", "Tiles", "Paint"], "correct": 0, "category": "Plumbing"},
    ],
    "electrical": [
        {"id": "elec_1", "question": "Before working on a circuit you should?", "options": ["Lock-out/tag-out and verify dead with tester", "Assume it's off", "Wet hands only", "Work live always"], "correct": 0, "category": "Electrical"},
        {"id": "elec_2", "question": "Earth/grounding protects people by?", "options": ["Providing fault current path to trip breaker", "Increasing shock voltage", "Removing insulation", "Painting wires"], "correct": 0, "category": "Electrical"},
        {"id": "elec_3", "question": "Cable size selection depends on?", "options": ["Only color", "Current, length/volt drop, and installation method", "Neighbor choice", "Cheapest always"], "correct": 1, "category": "Electrical"},
        {"id": "elec_4", "question": "MCB trips on?", "options": ["Overload/short per rating", "Birds flying", "Rainbow", "Paint smell"], "correct": 0, "category": "Electrical"},
        {"id": "elec_5", "question": "Solar DC side needs?", "options": ["Proper DC isolators, labeling, and PV-rated gear", "Only AC breakers randomly", "No disconnect", "Tape only"], "correct": 0, "category": "Electrical"},
        {"id": "elec_6", "question": "IP rating on outdoor fittings tells?", "options": ["Dust/water protection level", "Price only", "Weight of box", "Cable color"], "correct": 0, "category": "Electrical"},
        {"id": "elec_7", "question": "Megger/insulation test checks?", "options": ["Insulation resistance before energizing", "Pipe slope", "Concrete slump", "Harvest date"], "correct": 0, "category": "Electrical"},
        {"id": "elec_8", "question": "Neutral and earth must not be?", "options": ["Bonded wrongly on load side against code", "Used at all", "Green sometimes", "In conduit"], "correct": 0, "category": "Electrical"},
        {"id": "elec_9", "question": "Extension cords on site should be?", "options": ["Rated, inspected, and not daisy-chained overloaded", "Undersized long reels coiled hot", "Under water", "Cut conductors exposed"], "correct": 0, "category": "Electrical"},
        {"id": "elec_10", "question": "RCD/GFCI helps prevent?", "options": ["Shock from leakage currents", "Over-tightening screws", "Paint bubbles", "Rust on tiles"], "correct": 0, "category": "Electrical"},
    ],
    "tailoring": [
        {"id": "tail_1", "question": "Measuring bust/chest correctly requires?", "options": ["Snug tape, parallel to floor, normal posture", "One arm up only", "Guess", "Tape diagonal always"], "correct": 0, "category": "Tailoring"},
        {"id": "tail_2", "question": "Fabric grainline affects?", "options": ["Drape, stretch direction, and pattern alignment", "Only button color", "Machine oil", "Room lighting"], "correct": 0, "category": "Tailoring"},
        {"id": "tail_3", "question": "Sewing machine tension imbalance shows as?", "options": ["Loops on top or bottom thread", "Perfect stitches always", "Louder radio", "Shorter table"], "correct": 0, "category": "Tailoring"},
        {"id": "tail_4", "question": "Interfacing is used to?", "options": ["Stabilize collars/cuffs and areas needing body", "Soak fabric", "Shrink only", "Dye leather"], "correct": 0, "category": "Tailoring"},
        {"id": "tail_5", "question": "Hem allowance should be?", "options": ["Consistent, pressed, and finished per fabric", "Random frayed", "Zero always", "Triple folded metal"], "correct": 0, "category": "Tailoring"},
        {"id": "tail_6", "question": "Pattern 'notches' help?", "options": ["Match pieces accurately", "Decorate only", "Cut faster wrong", "Remove seams"], "correct": 0, "category": "Tailoring"},
        {"id": "tail_7", "question": "Knit vs woven handling differs because?", "options": ["Knits stretch; stabilize edges and choose appropriate stitch", "Same always", "Woven never frays", "Iron never used"], "correct": 0, "category": "Tailoring"},
        {"id": "tail_8", "question": "Zipper insertion needs?", "options": ["Correct foot, basting, and alignment", "Only glue", "Hammer only", "No stops"], "correct": 0, "category": "Tailoring"},
        {"id": "tail_9", "question": "Client fitting alteration priority is?", "options": ["Balance, ease, then length details", "Only shorten sleeves randomly", "Ignore shoulders", "Add padding blindly"], "correct": 0, "category": "Tailoring"},
        {"id": "tail_10", "question": "Iron temperature should follow?", "options": ["Fabric fiber care labels", "Maximum always", "Cold for silk and wool always wrong", "No steam ever"], "correct": 0, "category": "Tailoring"},
    ],
    "driving": [
        {"id": "drv_1", "question": "Pre-trip inspection should check?", "options": ["Brakes, tires, lights, steering, leaks, and load security", "Only paint shine", "Radio presets", "Seat fabric brand"], "correct": 0, "category": "Driving"},
        {"id": "drv_2", "question": "Hill start with load needs?", "options": ["Parking brake/hand valve coordination and low gear", "Clutch dump always", "Neutral roll", "High gear only"], "correct": 0, "category": "Driving"},
        {"id": "drv_3", "question": "Following distance on rural roads should?", "options": ["Increase with speed, load, and poor visibility", "Be one foot always", "Ignore weather", "Match bumper stickers"], "correct": 0, "category": "Driving"},
        {"id": "drv_4", "question": "PTO engagement requires?", "options": ["Engine rpm stable, clear area, and guard in place", "People near shaft", "Random gear", "No training"], "correct": 0, "category": "Driving"},
        {"id": "drv_5", "question": "Overloading axle affects?", "options": ["Braking distance and tire failure risk", "Only fuel color", "Engine brand", "Mirror size"], "correct": 0, "category": "Driving"},
        {"id": "drv_6", "question": "Hydraulic hose burst near you means?", "options": ["Stop safely, relieve pressure, replace — never grab leak", "Grab with bare hands", "Ignore", "Tighten with teeth"], "correct": 0, "category": "Driving"},
        {"id": "drv_7", "question": "Night driving fatigue countermeasures include?", "options": ["Breaks, hydration, and avoid staring at one point", "Phone films", "Faster speeds", "Dim lights off"], "correct": 0, "category": "Driving"},
        {"id": "drv_8", "question": "Trailer sway first response is?", "options": ["Ease throttle, straight steering, avoid sudden braking if safe", "Hard brake and jerk wheel", "Accelerate hard always", "Unload at speed"], "correct": 0, "category": "Driving"},
        {"id": "drv_9", "question": "Seatbelt and ROPS on tractors save lives by?", "options": ["Restraint and rollover protection structure", "Increasing noise", "Removing mirrors", "Adding weight only"], "correct": 0, "category": "Driving"},
        {"id": "drv_10", "question": "Farm road crossings with implements need?", "options": ["Flags/markers, escort if wide, and signal early", "No lights", "Speed through town", "Hide width"], "correct": 0, "category": "Driving"},
    ],
    "pottery": [
        {"id": "pot_1", "question": "Wedging clay removes?", "options": ["Air pockets and homogenizes moisture", "Only color", "Kiln heat", "Glaze"], "correct": 0, "category": "Pottery"},
        {"id": "pot_2", "question": "Leather-hard stage is good for?", "options": ["Trimming and handles", "Bisque fire", "Glazing finished", "Shipping dry"], "correct": 0, "category": "Pottery"},
        {"id": "pot_3", "question": "Bisque firing too fast can cause?", "options": ["Cracks/explosions from trapped moisture/steam", "Stronger always", "No change", "Better glaze"], "correct": 0, "category": "Pottery"},
        {"id": "pot_4", "question": "Glaze thickness issues show as?", "options": ["Runs, pinholes, or crawling", "Perfect always", "Only darker room", "Lighter clay only"], "correct": 0, "category": "Pottery"},
        {"id": "pot_5", "question": "Kiln ventilation protects from?", "options": ["Fumes and heat stress", "Birds", "Rain inside", "Clay price"], "correct": 0, "category": "Pottery"},
        {"id": "pot_6", "question": "Throwing centered clay prevents?", "options": ["Wobble and uneven walls", "Faster drying only", "Wheel spin", "Tool rust"], "correct": 0, "category": "Pottery"},
        {"id": "pot_7", "question": "Recycling scrap clay needs?", "options": ["Slaking, screening, and re-wedging", "Burn immediately", "Mix with cement only", "Leave in sun uncovered forever"], "correct": 0, "category": "Pottery"},
        {"id": "pot_8", "question": "Foot ring on pots helps?", "options": ["Stable sitting and glaze clearance", "Nothing", "Stop water boiling", "Increase cracks"], "correct": 0, "category": "Pottery"},
        {"id": "pot_9", "question": "Underglaze vs overglaze timing differs because?", "options": ["Firing temps and surface state differ", "Same always", "Never used", "Only for metal"], "correct": 0, "category": "Pottery"},
        {"id": "pot_10", "question": "Silica dust control means?", "options": ["Wet clean, masks where needed, and local exhaust", "Dry sweep only", "Blow with mouth", "Ignore"], "correct": 0, "category": "Pottery"},
    ],
    "beekeeping": [
        {"id": "bee_1", "question": "Opening hive best time is often?", "options": ["Warm calm day when bees are flying", "Night without light", "During heavy rain always", "Random midnight"], "correct": 0, "category": "Beekeeping"},
        {"id": "bee_2", "question": "Swarm prevention includes?", "options": ["Space management, queen health, and splits when crowded", "Removing all frames", "Sealing entrance", "Loud music"], "correct": 0, "category": "Beekeeping"},
        {"id": "bee_3", "question": "Varroa monitoring matters because?", "options": ["Mites weaken colonies and spread viruses", "Mites help honey", "Mites are decorative", "Mites increase queen speed"], "correct": 0, "category": "Beekeeping"},
        {"id": "bee_4", "question": "Smoker fuel should be?", "options": ["Cool thick smoke, not hot flame into hive", "Petrol soaked", "Plastic bags primary", "Wet chlorine"], "correct": 0, "category": "Beekeeping"},
        {"id": "bee_5", "question": "Honey extraction needs?", "options": ["Capped frames, uncapping, extractor balance, and moisture test", "Heat mud", "Add water to frames", "Shake into dirt"], "correct": 0, "category": "Beekeeping"},
        {"id": "bee_6", "question": "Winter feeding when stores low uses?", "options": ["Sugar syrup or fondant per local practice", "Salt water", "Kerosene", "Nothing ever"], "correct": 0, "category": "Beekeeping"},
        {"id": "bee_7", "question": "Queen cells seen before flow may mean?", "options": ["Swarm/supersedure prep — inspect space and queen", "Ignore always", "Paint hive", "Remove all bees"], "correct": 0, "category": "Beekeeping"},
        {"id": "bee_8", "question": "Apiary siting should consider?", "options": ["Forage, wind, shade, water, neighbors, and flight paths", "Only roof color", "Under highway", "Dark closed room"], "correct": 0, "category": "Beekeeping"},
        {"id": "bee_9", "question": "Protective gear minimum is often?", "options": ["Veil + gloves for beginners; reduce as skilled", "No veil ever", "Shorts only", "Bare hands in angry hive"], "correct": 0, "category": "Beekeeping"},
        {"id": "bee_10", "question": "Ant control under hive stands uses?", "options": ["Oil/moat barriers or physical isolation", "Pour honey on ground", "Glue bees", "Gasoline on soil"], "correct": 0, "category": "Beekeeping"},
    ],
    "fishing": [
        {"id": "fish_1", "question": "Life jacket on small boats is?", "options": ["Basic safety even if you swim", "Optional always", "Only for kids under 3", "Replaced by rope"], "correct": 0, "category": "Fishing"},
        {"id": "fish_2", "question": "Net mending keeps?", "options": ["Mesh size legal and catches efficient", "Holes bigger illegal", "Net heavier only", "Boat slower only"], "correct": 0, "category": "Fishing"},
        {"id": "fish_3", "question": "Ice storage for catch needs?", "options": ["Clean ice, drain slurry, and quick chill", "Warm blanket", "Sun exposure", "Freshwater only on deck always"], "correct": 0, "category": "Fishing"},
        {"id": "fish_4", "question": "Weather check before sea trip prevents?", "options": ["Getting caught in squalls/rough seas", "Catching fish", "Fuel use", "Net color change"], "correct": 0, "category": "Fishing"},
        {"id": "fish_5", "question": "Engine kill switch lanyard is for?", "options": ["Stopping engine if operator falls", "Music pause", "Anchor release", "GPS off"], "correct": 0, "category": "Fishing"},
        {"id": "fish_6", "question": "Bycatch reduction includes?", "options": ["Selective gear, timing, and handling", "Larger mesh illegal always wrong", "Ignore rules", "Dump all"], "correct": 0, "category": "Fishing"},
        {"id": "fish_7", "question": "Bilge with fuel smell means?", "options": ["Ventilate, find leak, no sparks", "Start engine fast", "Smoke nearby", "Ignore"], "correct": 0, "category": "Fishing"},
        {"id": "fish_8", "question": "Longline hooks storage should?", "options": ["Be secured; cut-resistant gloves when handling", "Loose in cockpit", "In pocket", "Bare feet only"], "correct": 0, "category": "Fishing"},
        {"id": "fish_9", "question": "Tide/current affects?", "options": ["Set and drift of gear and boat handling", "Only moon color", "Engine brand", "Rope material only"], "correct": 0, "category": "Fishing"},
        {"id": "fish_10", "question": "Dock line spring line helps?", "options": ["Absorb surge and reduce slamming", "Increase surge", "Replace fenders", "Remove cleats"], "correct": 0, "category": "Fishing"},
    ],
    "animal_care": [
        {"id": "ac_1", "question": "Fresh clean water for livestock is?", "options": ["Daily essential", "Weekly ok", "Only summer", "Replaced by salt"], "correct": 0, "category": "Animal Care"},
        {"id": "ac_2", "question": "Body condition scoring helps?", "options": ["Adjust feed before animals crash", "Choose paint", "Select TV", "Ignore health"], "correct": 0, "category": "Animal Care"},
        {"id": "ac_3", "question": "Foot trimming in goats/sheep prevents?", "options": ["Overgrowth lameness and hoof rot risk", "Wool growth", "Milk protein", "Egg laying"], "correct": 0, "category": "Animal Care"},
        {"id": "ac_4", "question": "Quarantine new animals reduces?", "options": ["Disease introduction", "Feed cost", "Water need", "Fence height"], "correct": 0, "category": "Animal Care"},
        {"id": "ac_5", "question": "Heat stress signs include?", "options": ["Panting, drooling, reduced feed intake", "Sleeping more only", "Brighter feathers always", "Faster egg paint"], "correct": 0, "category": "Animal Care"},
        {"id": "ac_6", "question": "Poultry litter management needs?", "options": ["Dryness, ventilation, and periodic renewal", "Wet cake always", "Closed sheds forever", "No bedding"], "correct": 0, "category": "Animal Care"},
        {"id": "ac_7", "question": "Dewormer rotation/resistance strategy should be?", "options": ["Faecal egg counts and vet-guided plans", "Same drug forever", "Weekly random dose", "Only vitamins"], "correct": 0, "category": "Animal Care"},
        {"id": "ac_8", "question": "Calving/lambing kit includes?", "options": ["Clean ropes, gloves, disinfectant, thermometer, vet contacts", "Paint brushes", "Sandpaper", "Glue"], "correct": 0, "category": "Animal Care"},
        {"id": "ac_9", "question": "Fly control integrates?", "options": ["Manure management, traps, and targeted sprays", "More manure piles near shed", "Remove ventilation", "Ignore bites"], "correct": 0, "category": "Animal Care"},
        {"id": "ac_10", "question": "Record keeping for treatments tracks?", "options": ["Withdrawal periods and repeat doses", "Only animal names", "Grass color", "Fence paint"], "correct": 0, "category": "Animal Care"},
    ],
    "cooking": [
        {"id": "cook_1", "question": "Potentially hazardous foods left in danger zone (5–60°C) for hours should be?", "options": ["Discarded for safety in institutional feeding", "Re-chilled without heat", "Mixed with spices only", "Fed to infants first"], "correct": 0, "category": "Cooking"},
        {"id": "cook_2", "question": "Cross-contamination prevention means?", "options": ["Separate boards/knives for raw vs cooked", "Same cloth for all", "Wash hands never", "Store meat above salad"], "correct": 0, "category": "Cooking"},
        {"id": "cook_3", "question": "Thick dal/gravy must be stirred while boiling to?", "options": ["Prevent bottom scorch and uneven heating", "Make it colder", "Remove protein", "Avoid taste"], "correct": 0, "category": "Cooking"},
        {"id": "cook_4", "question": "Oil reuse signs to stop using include?", "options": ["Dark color, smoke point drop, foaming, off smell", "Clear look", "First use only rule never", "More salt"], "correct": 0, "category": "Cooking"},
        {"id": "cook_5", "question": "Chapati dough resting helps?", "options": ["Gluten relax for rolling", "Remove gluten always", "Increase bugs", "Dry faster only"], "correct": 0, "category": "Cooking"},
        {"id": "cook_6", "question": "Large batch cooling for storage should?", "options": ["Divide shallow pans / ice bath to pass through danger zone fast", "Seal boiling hot food in a drum and leave at room temp", "Leave covered hot overnight at room temp", "Add raw onions to cool"], "correct": 0, "category": "Cooking"},
        {"id": "cook_7", "question": "Allergen awareness in community kitchens requires?", "options": ["Labeling and separate prep when needed", "Hide ingredients", "Guess", "Mix all"], "correct": 0, "category": "Cooking"},
        {"id": "cook_8", "question": "Sanitizer concentration must be?", "options": ["Per manufacturer PPM checks", "Random strong bleach always", "Only water", "Vinegar for all surfaces always"], "correct": 0, "category": "Cooking"},
        {"id": "cook_9", "question": "Reheating food must reach?", "options": ["Steaming hot throughout (institutional guidance)", "Warm outside only", "Cold center ok", "Sun temp"], "correct": 0, "category": "Cooking"},
        {"id": "cook_10", "question": "Pest control in storeroom starts with?", "options": ["Sealed containers and cleaning, then targeted control", "Poison near food open", "Leave spills", "Dark only"], "correct": 0, "category": "Cooking"},
    ],
    "weaving": [
        {"id": "weav_1", "question": "Warp tension evenness prevents?", "options": ["Broken ends and uneven cloth", "Faster only", "Better knots in air", "Loom color change"], "correct": 0, "category": "Weaving"},
        {"id": "weav_2", "question": "Sleying reed determines?", "options": ["Ends per inch (EPI) and width", "Only weft color", "Oil level", "Room size"], "correct": 0, "category": "Weaving"},
        {"id": "weav_3", "question": "Shuttle threading checks avoid?", "options": ["Mispicks and snags", "Better selvedge always wrong", "Noise only", "Warping"], "correct": 0, "category": "Weaving"},
        {"id": "weav_4", "question": "Selvedge issues often fixed by?", "options": ["Temple use, tension, and weft angle", "Cutting warp", "More dust", "Less treadling"], "correct": 0, "category": "Weaving"},
        {"id": "weav_5", "question": "Bobbin winding should be?", "options": ["Firm sides, not overly tight cheese", "Loose lumps", "Oval only", "Random"], "correct": 0, "category": "Weaving"},
        {"id": "weav_6", "question": "Draft pattern errors show as?", "options": ["Wrong tie-up/treadle sequence", "Only dye fade", "Humidity only", "Loom brand"], "correct": 0, "category": "Weaving"},
        {"id": "weav_7", "question": "Natural dye mordanting helps?", "options": ["Fix color and fastness", "Remove fiber", "Shrink reed", "Oil heddles"], "correct": 0, "category": "Weaving"},
        {"id": "weav_8", "question": "Warp yarn count change affects?", "options": ["Sett, strength, and hand of cloth", "Nothing", "Only bobbin size", "Noise"], "correct": 0, "category": "Weaving"},
        {"id": "weav_9", "question": "Dust from fibers requires?", "options": ["Ventilation and masks when needed", "Blow into room", "Wet loom electrics", "Ignore"], "correct": 0, "category": "Weaving"},
        {"id": "weav_10", "question": "Cloth inspection off-loom catches?", "options": ["Defects before finishing", "Only weight", "Music tempo", "Shuttle brand"], "correct": 0, "category": "Weaving"},
    ],
    "general": [
        {"id": "gen_1", "question": "PPE when unsure means?", "options": ["Use minimum gloves/helmet/shoes for task", "No PPE faster", "Sandals on rebar", "Loose clothes near machine"], "correct": 0, "category": "General"},
        {"id": "gen_2", "question": "Near-miss reporting helps?", "options": ["Fix hazards before injury", "Hide problems", "Slow work only", "Increase fines only"], "correct": 0, "category": "General"},
        {"id": "gen_3", "question": "Lifting heavy sack safely?", "options": ["Legs bent, neutral spine, team lift if heavy", "Twist and jerk", "One hand only always", "Hold breath forever"], "correct": 0, "category": "General"},
        {"id": "gen_4", "question": "Chemical splash in eye first step?", "options": ["Flush with clean water per duration guidance and seek care", "Rub hard", "Wait overnight", "Apply oil"], "correct": 0, "category": "General"},
        {"id": "gen_5", "question": "Confined space entry needs?", "options": ["Ventilation test, attendant, and rescue plan", "Go alone fast", "Candle only", "Phone torch enough always"], "correct": 0, "category": "General"},
        {"id": "gen_6", "question": "Tool maintenance prevents?", "options": ["Slips and sudden breakage", "Better rust only", "Training", "Teamwork"], "correct": 0, "category": "General"},
        {"id": "gen_7", "question": "Housekeeping on site reduces?", "options": ["Trips/fires and lost tools", "Productivity always", "Communication", "Pay"], "correct": 0, "category": "General"},
        {"id": "gen_8", "question": "Heat illness first aid includes?", "options": ["Cool shade, fluids, and medical help if confusion", "More sun", "Heavy coat", "Sprint"], "correct": 0, "category": "General"},
        {"id": "gen_9", "question": "Stop work authority is for?", "options": ["Anyone seeing imminent danger", "Only CEO", "Never used", "Guests only"], "correct": 0, "category": "General"},
        {"id": "gen_10", "question": "Good handover between shifts includes?", "options": ["Status, hazards, and incomplete tasks", "Only jokes", "Hide incidents", "Passwords only"], "correct": 0, "category": "General"},
    ],
}


def _validate_bank() -> None:
    for key, qs in QUESTION_BANK.items():
        if len(qs) != EXAM_QUESTION_COUNT:
            raise ValueError(f"Domain '{key}' must have {EXAM_QUESTION_COUNT} questions, has {len(qs)}")


_validate_bank()


def resolve_exam_domain(skill_hint: str, job_category: str, job_skills: list[str]) -> str:
    """Map free-text hints to a QUESTION_BANK key.

    Primary job skill / first skill on the job wins over broad categories
    (e.g. skill Dairy + category Agriculture → dairy exam, not farming).
    """
    focus_parts: list[str] = []
    if skill_hint:
        focus_parts.append(skill_hint.lower().strip())
    for s in job_skills:
        if s:
            focus_parts.append(s.lower().strip())
    focus = " | ".join(focus_parts)

    def has_focus(*keys: str) -> bool:
        if not focus:
            return False
        return any(k in focus for k in keys)

    # --- 1) Strong match from explicit skills on the job (preferred) ---
    if has_focus("dairy", "milking", "buffalo", "cow milk", "milk"):
        return "dairy"
    if has_focus("plumb", "pipe", "fitting", "jal"):
        return "plumbing"
    if has_focus("electric", "wiring", "solar", "installer"):
        return "electrical"
    if has_focus("tailor", "stitch", "darji", "garment", "weaving", "loom", "saree", "handloom"):
        if has_focus("weav", "loom", "saree", "handloom"):
            return "weaving"
        return "tailoring"
    if has_focus("potter", "clay", "kiln", "terracotta"):
        return "pottery"
    if has_focus("beekeep", "hive", "honey"):
        return "beekeeping"
    if has_focus("fish", "net", "boat", "catch", "fisher"):
        return "fishing"
    if has_focus("animal care", "poultry", "livestock", "goat", "cattle", "hens"):
        return "animal_care"
    if has_focus("cook", "kitchen", "food safety", "meal", "catering"):
        return "cooking"
    if has_focus("mason", "mistri", "brick", "plaster", "raj mistri"):
        return "masonry"
    if has_focus("drive", "driver", "tractor", "vehicle", "mechanic", "repair", "garage"):
        return "driving"
    if has_focus("farm", "agri", "crop", "harvest", "wheat", "field", "cultivation"):
        return "farming"

    # --- 2) Fallback: job category only ---
    cat = (job_category or "").lower().strip()
    if "dairy" in cat:
        return "dairy"
    if "poultry" in cat:
        return "animal_care"
    if "fisher" in cat:
        return "fishing"
    if "bee" in cat or "honey" in cat:
        return "beekeeping"
    if "energy" in cat or "solar" in cat:
        return "electrical"
    if "mechanical" in cat or "mechanic" in cat:
        return "driving"
    if "construction" in cat:
        return "masonry"
    if "craft" in cat or "handloom" in cat or "khadi" in cat:
        return "weaving"
    if "community" in cat or "anganwadi" in cat:
        return "cooking"
    if "animal husbandry" in cat:
        return "animal_care"
    if "agriculture" in cat or "horticulture" in cat or "mushroom" in cat:
        return "farming"

    # --- 3) Whole-text blob (skill + category + skills) for odd titles ---
    blob = " | ".join(p for p in [focus, cat] if p)

    def has(*keys: str) -> bool:
        return any(k in blob for k in keys)

    if has("dairy", "milking", "buffalo", "cow milk"):
        return "dairy"
    if has("farm", "agri", "crop", "harvest", "wheat", "tractor", "field"):
        return "farming"
    if has("mason", "mistri", "brick", "plaster"):
        return "masonry"
    if has("plumb", "pipe", "fitting"):
        return "plumbing"
    if has("electric", "wiring", "solar"):
        return "electrical"
    if has("tailor", "stitch", "darji"):
        return "tailoring"
    if has("drive", "tractor driver", "vehicle"):
        return "driving"
    if has("potter", "clay", "kiln"):
        return "pottery"
    if has("beekeep", "hive", "honey harvest"):
        return "beekeeping"
    if has("fish", "net", "boat"):
        return "fishing"
    if has("animal care", "poultry", "livestock", "goat", "cattle"):
        return "animal_care"
    if has("cook", "kitchen", "food safety", "meal"):
        return "cooking"
    if has("weav", "loom"):
        return "weaving"

    return "general"


def get_questions_for_domain(domain_key: str) -> list[dict]:
    qs = QUESTION_BANK.get(domain_key) or QUESTION_BANK["general"]
    return list(qs[:EXAM_QUESTION_COUNT])


def get_exam_overview() -> dict:
    domains = []
    total = 0
    for key, qs in sorted(QUESTION_BANK.items()):
        n = len(qs)
        total += n
        domains.append(
            {
                "key": key,
                "questionCount": n,
                "expectedPerExam": EXAM_QUESTION_COUNT,
                "ready": n == EXAM_QUESTION_COUNT,
            }
        )
    return {
        "questionsPerExam": EXAM_QUESTION_COUNT,
        "domains": domains,
        "totalBankQuestions": total,
        "domainCount": len(QUESTION_BANK),
    }
