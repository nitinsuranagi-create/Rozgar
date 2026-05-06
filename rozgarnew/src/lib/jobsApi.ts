import { Job } from './mockData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

type ApiJob = {
  id: string;
  title: string;
  category: string;
  location: string;
  pay: string;
  type: Job['type'];
  postedBy: string;
  postedAt: string;
  description: string;
  skills: string[];
  applicants: number;
  trending?: boolean;
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

const mapJob = (j: ApiJob): Job => ({
  ...j,
  postedAt: timeAgo(j.postedAt),
});

export const fetchJobs = async (): Promise<Job[]> => {
  const res = await fetch(`${API_BASE}/jobs`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to load jobs');
  return (data.jobs || []).map(mapJob);
};

export const fetchJobById = async (id: string): Promise<Job | null> => {
  const jobs = await fetchJobs();
  return jobs.find(j => j.id === id) || null;
};

export const createJob = async (payload: Omit<Job, 'id' | 'postedAt' | 'applicants'>): Promise<Job> => {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to create job');
  return mapJob(data.job);
};
