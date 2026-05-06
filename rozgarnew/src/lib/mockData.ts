// Mock data for ROZGAR — replace with backend API calls.
// TODO: connect backend API

export interface Job {
  id: string;
  title: string;
  category: string;
  location: string;
  pay: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Daily';
  postedBy: string;
  postedAt: string;
  description: string;
  skills: string[];
  trending?: boolean;
  applicants: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userRole?: string;
  userAge?: number;
  userDob?: string;
  userExperience?: string;
  userSkills?: string[];
  phone?: string;
  village?: string;
  note?: string;
  status: 'Pending' | 'Pass' | 'Fail' | 'Accepted' | 'Rejected';
  score?: number;
  appliedAt: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  category: string;
}

export const MOCK_JOBS: Job[] = [
  { id: 'j1', title: 'Wheat Harvest Worker', category: 'Agriculture', location: 'Punjab', pay: '₹600/day', type: 'Daily', postedBy: 'Singh Farms', postedAt: '2d ago', description: 'Help with wheat harvesting season. Experience with sickle and basic farm tools required.', skills: ['Farming', 'Harvesting'], trending: true, applicants: 42 },
  { id: 'j2', title: 'Dairy Farm Assistant', category: 'Dairy', location: 'Gujarat', pay: '₹12,000/mo', type: 'Full-time', postedBy: 'Amul Co-op', postedAt: '1d ago', description: 'Daily milking, feeding cattle, basic veterinary care.', skills: ['Animal Care', 'Dairy'], trending: true, applicants: 28 },
  { id: 'j3', title: 'Handloom Weaver', category: 'Crafts', location: 'West Bengal', pay: '₹15,000/mo', type: 'Full-time', postedBy: 'Khadi Bhandar', postedAt: '3d ago', description: 'Skilled weaver for traditional cotton sarees.', skills: ['Weaving', 'Handicraft'], applicants: 17 },
  { id: 'j4', title: 'Mason / Raj Mistri', category: 'Construction', location: 'Rajasthan', pay: '₹800/day', type: 'Daily', postedBy: 'Sharma Builders', postedAt: '5h ago', description: 'Brick laying and plastering for village school project.', skills: ['Masonry', 'Construction'], trending: true, applicants: 56 },
  { id: 'j5', title: 'Tractor Driver', category: 'Agriculture', location: 'Haryana', pay: '₹14,000/mo', type: 'Full-time', postedBy: 'GreenAcres', postedAt: '1d ago', description: 'Operate tractor for ploughing and transport. License required.', skills: ['Driving', 'Farming'], applicants: 22 },
  { id: 'j6', title: 'Poultry Caretaker', category: 'Poultry', location: 'Tamil Nadu', pay: '₹10,000/mo', type: 'Full-time', postedBy: 'Suguna Farms', postedAt: '4d ago', description: 'Care for hens, eggs collection, hygiene maintenance.', skills: ['Animal Care', 'Poultry'], applicants: 12 },
  { id: 'j7', title: 'Solar Panel Installer', category: 'Energy', location: 'Madhya Pradesh', pay: '₹18,000/mo', type: 'Contract', postedBy: 'SunRural Pvt', postedAt: '2d ago', description: 'Install rooftop solar panels in village homes.', skills: ['Electrical', 'Installation'], trending: true, applicants: 33 },
  { id: 'j8', title: 'Pottery Artisan', category: 'Crafts', location: 'Uttar Pradesh', pay: '₹9,000/mo', type: 'Part-time', postedBy: 'Khurja Pottery', postedAt: '6d ago', description: 'Traditional pottery and terracotta crafting.', skills: ['Pottery', 'Handicraft'], applicants: 8 },
  { id: 'j9', title: 'Beekeeper', category: 'Agriculture', location: 'Himachal Pradesh', pay: '₹13,000/mo', type: 'Full-time', postedBy: 'Honey Hills', postedAt: '1w ago', description: 'Maintain hives, harvest honey, swarm management.', skills: ['Beekeeping', 'Farming'], applicants: 6 },
  { id: 'j10', title: 'Plumber', category: 'Construction', location: 'Bihar', pay: '₹700/day', type: 'Daily', postedBy: 'Jal Jeevan Mission', postedAt: '3d ago', description: 'Pipe fitting and water supply work in village.', skills: ['Plumbing'], applicants: 19 },
  { id: 'j11', title: 'Anganwadi Helper', category: 'Community', location: 'Odisha', pay: '₹8,500/mo', type: 'Full-time', postedBy: 'Govt Co-op', postedAt: '2d ago', description: 'Assist with childcare and meals at Anganwadi center.', skills: ['Childcare', 'Cooking'], applicants: 24 },
  { id: 'j12', title: 'Mushroom Cultivation', category: 'Agriculture', location: 'Uttarakhand', pay: '₹11,000/mo', type: 'Full-time', postedBy: 'AgroNext', postedAt: '4d ago', description: 'Grow oyster and button mushrooms.', skills: ['Farming', 'Horticulture'], applicants: 14 },
  { id: 'j13', title: 'Tailor / Darji', category: 'Crafts', location: 'Maharashtra', pay: '₹10,500/mo', type: 'Full-time', postedBy: 'Village Stitch', postedAt: '2d ago', description: 'Stitching traditional and modern garments.', skills: ['Tailoring', 'Stitching'], applicants: 31 },
  { id: 'j14', title: 'Fisherman Helper', category: 'Fisheries', location: 'Kerala', pay: '₹600/day', type: 'Daily', postedBy: 'Coast Co-op', postedAt: '1d ago', description: 'Net casting and catch sorting on small boats.', skills: ['Fishing'], trending: true, applicants: 18 },
  { id: 'j15', title: 'Auto Mechanic', category: 'Mechanical', location: 'Andhra Pradesh', pay: '₹13,500/mo', type: 'Full-time', postedBy: 'RuralRide Garage', postedAt: '5d ago', description: 'Service and repair two-wheelers and tractors.', skills: ['Mechanical', 'Repair'], applicants: 21 },
  { id: 'j16', title: 'Goat Rearing', category: 'Animal Husbandry', location: 'Jharkhand', pay: '₹9,500/mo', type: 'Full-time', postedBy: 'Bakri Co-op', postedAt: '3d ago', description: 'Care, grazing and breeding of goats.', skills: ['Animal Care'], applicants: 9 },
];

export const MOCK_QUESTIONS: Question[] = [
  { id: 'q1', category: 'Farming', question: 'Which season is ideal for sowing wheat in North India?', options: ['Kharif', 'Rabi', 'Zaid', 'Monsoon'], correct: 1 },
  { id: 'q2', category: 'Farming', question: 'Which tool is used for harvesting wheat manually?', options: ['Plough', 'Sickle', 'Hoe', 'Spade'], correct: 1 },
  { id: 'q3', category: 'Farming', question: 'Which fertilizer is rich in nitrogen?', options: ['Urea', 'DAP', 'Potash', 'Gypsum'], correct: 0 },
  { id: 'q4', category: 'Dairy', question: 'Average daily milk yield of a healthy buffalo?', options: ['2-3 L', '5-7 L', '8-12 L', '20+ L'], correct: 2 },
  { id: 'q5', category: 'Construction', question: 'Standard cement to sand ratio for plastering?', options: ['1:2', '1:4', '1:6', '1:10'], correct: 2 },
  { id: 'q6', category: 'Construction', question: 'Which tool checks if a wall is vertical?', options: ['Trowel', 'Plumb bob', 'Hammer', 'Chisel'], correct: 1 },
  { id: 'q7', category: 'Animal Care', question: 'How often should cattle be vaccinated against FMD?', options: ['Weekly', 'Monthly', 'Every 6 months', 'Yearly'], correct: 2 },
  { id: 'q8', category: 'General', question: 'Safety gear essential at any worksite?', options: ['Sandals', 'Gloves & Helmet', 'Sunglasses', 'Watch'], correct: 1 },
  { id: 'q9', category: 'General', question: 'What does MGNREGA guarantee?', options: ['Free food', '100 days work', 'Free housing', 'Free travel'], correct: 1 },
  { id: 'q10', category: 'Skills', question: 'Best practice if you don\'t know how to do a task?', options: ['Guess', 'Skip silently', 'Ask supervisor', 'Quit'], correct: 2 },
];

export const TRENDING_JOBS = MOCK_JOBS.filter(j => j.trending);

export const MOCK_APPLICATIONS: Application[] = [
  { id: 'a1', jobId: 'j1', jobTitle: 'Wheat Harvest Worker', userId: 'u1', userName: 'Ramesh Kumar', status: 'Pass', score: 85, appliedAt: '3d ago' },
  { id: 'a2', jobId: 'j4', jobTitle: 'Mason / Raj Mistri', userId: 'u2', userName: 'Sita Devi', status: 'Pending', appliedAt: '1d ago' },
  { id: 'a3', jobId: 'j2', jobTitle: 'Dairy Farm Assistant', userId: 'u3', userName: 'Mohan Lal', status: 'Pass', score: 72, appliedAt: '2d ago' },
  { id: 'a4', jobId: 'j7', jobTitle: 'Solar Panel Installer', userId: 'u4', userName: 'Priya Sharma', status: 'Fail', score: 45, appliedAt: '5d ago' },
  { id: 'a5', jobId: 'j13', jobTitle: 'Tailor / Darji', userId: 'u5', userName: 'Kavita Bai', status: 'Accepted', score: 91, appliedAt: '1w ago' },
];

export const PERFORMANCE_DATA = [
  { month: 'Jan', score: 60 }, { month: 'Feb', score: 68 },
  { month: 'Mar', score: 72 }, { month: 'Apr', score: 65 },
  { month: 'May', score: 80 }, { month: 'Jun', score: 85 },
  { month: 'Jul', score: 78 }, { month: 'Aug', score: 88 },
];

export const GROWTH_DATA = [
  { month: 'Jan', users: 120, jobs: 18 },
  { month: 'Feb', users: 180, jobs: 25 },
  { month: 'Mar', users: 240, jobs: 32 },
  { month: 'Apr', users: 320, jobs: 41 },
  { month: 'May', users: 410, jobs: 55 },
  { month: 'Jun', users: 520, jobs: 68 },
  { month: 'Jul', users: 640, jobs: 80 },
  { month: 'Aug', users: 790, jobs: 95 },
];

export const PASSING_SCORE = 60;
