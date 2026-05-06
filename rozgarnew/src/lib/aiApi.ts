const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export type AiChatUser = {
  id?: string;
  name?: string;
  email?: string;
  location?: string;
  skills?: string[];
};

export type AiChatResponse = {
  reply: string;
  recommendedJobs: Array<{
    id: string;
    title: string;
    location: string;
    pay: string;
    matchScore: number;
    skillMatchCount: number;
    locationMatch: boolean;
  }>;
  distanceNote?: string | null;
  usedModel: 'gemini' | 'fallback';
};

export const chatWithAi = async (message: string, user?: AiChatUser): Promise<AiChatResponse> => {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, user }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'AI service unavailable');
  return data;
};
