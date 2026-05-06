import { Application } from './mockData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

type ApiApplication = {
  id: string;
  jobId: string;
  jobTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  userAge?: number;
  userDob?: string;
  userExperience?: string;
  userSkills?: string[];
  phone?: string;
  village?: string;
  note?: string;
  status: Application['status'];
  score?: number;
  appliedAt: string;
};

const timeAgo = (iso: string) => {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const mapApplication = (a: ApiApplication): Application => ({
  ...a,
  appliedAt: timeAgo(a.appliedAt),
});

export const fetchApplications = async (): Promise<Application[]> => {
  const res = await fetch(`${API_BASE}/applications`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to load applications');
  return (data.applications || []).map(mapApplication);
};

export const createApplication = async (payload: {
  jobId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  userAge?: number;
  userDob?: string;
  userExperience?: string;
  userSkills?: string[];
  phone?: string;
  village?: string;
  note?: string;
}): Promise<Application> => {
  const res = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to apply for job');
  return mapApplication(data.application);
};

export const decideApplication = async (id: string, status: 'Accepted' | 'Rejected'): Promise<Application> => {
  const res = await fetch(`${API_BASE}/applications/${id}/decision`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to update application');
  return mapApplication(data.application);
};

export const submitApplicationExam = async (id: string, score: number, pass: boolean): Promise<Application> => {
  const res = await fetch(`${API_BASE}/applications/${id}/exam`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score, pass }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to submit exam');
  return mapApplication(data.application);
};
