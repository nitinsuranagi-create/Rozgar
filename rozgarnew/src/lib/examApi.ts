import { Question } from './mockData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const fetchExamQuestions = async (params: {
  skill: string;
  jobCategory: string;
  jobSkills: string[];
}): Promise<Question[]> => {
  const query = new URLSearchParams();
  query.set('skill', params.skill);
  query.set('jobCategory', params.jobCategory);
  if (params.jobSkills.length) query.set('jobSkills', params.jobSkills.join(','));
  const res = await fetch(`${API_BASE}/exam/questions?${query.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to load exam questions');
  return data.questions || [];
};

export type ExamOverview = {
  questionsPerExam: number;
  domainCount: number;
  totalBankQuestions: number;
  domains: { key: string; questionCount: number; expectedPerExam: number; ready: boolean }[];
};

export const fetchExamOverview = async (): Promise<ExamOverview> => {
  const res = await fetch(`${API_BASE}/exam/overview`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to load exam overview');
  return data;
};
