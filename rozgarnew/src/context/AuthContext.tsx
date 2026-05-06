import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Role = 'user' | 'admin';
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  location?: string;
  age?: number;
  dob?: string;
  experience?: string;
  skills?: string[];
}

interface AuthCtx {
  user: User | null;
  login: (email: string, password: string, role: Role) => Promise<User>;
  signup: (data: Omit<User, 'id'> & { password: string }) => Promise<User>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  useEffect(() => {
    const raw = localStorage.getItem('rozgar_user');
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login = async (email: string, password: string, role: Role) => {
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Login failed');
    const u: User = data.user;
    localStorage.setItem('rozgar_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const signup = async (data: Omit<User, 'id'> & { password: string }) => {
    const res = await fetch(`${apiBase}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const payload = await res.json();
    if (!res.ok) throw new Error(payload?.message || 'Signup failed');
    const u: User = payload.user;
    localStorage.setItem('rozgar_user', JSON.stringify(u));
    setUser(u);
    return u;
  };
  const logout = () => {
    if (user?.email) {
      fetch(`${apiBase}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      }).catch(() => {
        // Ignore network failures for local logout UX.
      });
    }
    localStorage.removeItem('rozgar_user');
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, signup, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used within AuthProvider');
  return c;
};
