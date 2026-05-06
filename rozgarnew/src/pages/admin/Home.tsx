import AdminLayout from '@/components/AdminLayout';
import { Application, Job } from '@/lib/mockData';
import { fetchApplications } from '@/lib/applicationsApi';
import { fetchJobs } from '@/lib/jobsApi';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Users, Briefcase, TrendingUp, ClipboardCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { fetchExamOverview, ExamOverview } from '@/lib/examApi';

const stat = (Icon: any, label: string, val: string, tone: string) => (
  <div className="bg-card border border-border rounded-2xl p-5">
    <div className={`w-10 h-10 rounded-xl grid place-items-center mb-3 ${tone}`}><Icon className="w-5 h-5"/></div>
    <div className="text-2xl font-bold">{val}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

const ageLabelToDays = (label?: string) => {
  if (!label) return null;
  if (label === 'just now') return 0;
  const m = /^(\d+)([mhdw]) ago$/.exec(label.trim());
  if (!m) return null;
  const n = Number(m[1]);
  if (m[2] === 'm') return n / 1440;
  if (m[2] === 'h') return n / 24;
  if (m[2] === 'd') return n;
  return n * 7;
};

const AdminHome = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [liveJobsCount, setLiveJobsCount] = useState(0);
  const [activeWorkersCount, setActiveWorkersCount] = useState(0);
  const [examOverview, setExamOverview] = useState<ExamOverview | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
        const [apps, jobs, overview] = await Promise.all([fetchApplications(), fetchJobs(), fetchExamOverview()]);
        setApplications(apps);
        setJobs(jobs);
        setLiveJobsCount(jobs.length);
        setExamOverview(overview);
        const workersRes = await fetch(`${apiBase}/auth/active-workers-count`);
        const workersData = await workersRes.json();
        if (!workersRes.ok) throw new Error(workersData?.message || 'Failed to load active workers');
        setActiveWorkersCount(workersData.count || 0);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load dashboard data');
      }
    };
    load();
  }, []);

  const growthData = useMemo(() => {
    const weeks = Array.from({ length: 6 }, (_, idx) => ({
      month: `W${idx + 1}`,
      users: 0,
      jobs: 0,
    }));

    applications.forEach((a) => {
      const days = ageLabelToDays(a.appliedAt);
      if (days == null) return;
      const bucket = 5 - Math.floor(days / 7);
      if (bucket >= 0 && bucket < weeks.length) {
        weeks[bucket].users += 1;
      }
    });

    jobs.forEach((j) => {
      const days = ageLabelToDays(j.postedAt);
      if (days == null) return;
      const bucket = 5 - Math.floor(days / 7);
      if (bucket >= 0 && bucket < weeks.length) {
        weeks[bucket].jobs += 1;
      }
    });

    return weeks;
  }, [applications, jobs]);

  const growthPct = useMemo(() => {
    const currentWeek = growthData[growthData.length - 1]?.users ?? 0;
    const previousWeek = growthData[growthData.length - 2]?.users ?? 0;
    if (previousWeek === 0) return currentWeek > 0 ? 100 : 0;
    return Math.round(((currentWeek - previousWeek) / previousWeek) * 100);
  }, [growthData]);

  const growthText = `${growthPct >= 0 ? '+' : ''}${growthPct}%`;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-2">Welcome, Admin 👋</h1>
      <p className="text-muted-foreground mb-6">Here's a snapshot of your platform.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stat(Users, 'Active Workers', `${activeWorkersCount}`, 'bg-primary/15 text-primary')}
        {stat(Briefcase, 'Live Jobs', `${liveJobsCount}`, 'bg-accent/15 text-accent')}
        {stat(ClipboardCheck, 'Applications', `${applications.length}`, 'bg-success/15 text-success')}
        {stat(TrendingUp, 'Growth (WoW)', growthText, 'bg-warning/15 text-warning')}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold mb-4">Platform Growth</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12 }}/>
                <Legend/>
                <Bar dataKey="users" fill="hsl(var(--primary))" radius={[8,8,0,0]}/>
                <Bar dataKey="jobs" fill="hsl(var(--accent))" radius={[8,8,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold mb-4">Skill exams (question bank)</h3>
          {!examOverview && (
            <div className="text-sm text-muted-foreground">Loading exam data…</div>
          )}
          {examOverview && (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                Each candidate exam uses <span className="font-semibold text-foreground">{examOverview.questionsPerExam}</span> questions per attempt.
                Bank covers <span className="font-semibold text-foreground">{examOverview.domainCount}</span> skill domains (
                <span className="font-semibold text-foreground">{examOverview.totalBankQuestions}</span> total MCQs).
              </p>
              <div className="max-h-48 overflow-y-auto text-xs border border-border rounded-lg">
                <table className="w-full text-left">
                  <thead className="bg-secondary/50 sticky top-0">
                    <tr>
                      <th className="p-2">Domain</th>
                      <th className="p-2">Questions</th>
                      <th className="p-2">Ready</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examOverview.domains.map((d) => (
                      <tr key={d.key} className="border-t border-border">
                        <td className="p-2 font-medium capitalize">{d.key.replace(/_/g, ' ')}</td>
                        <td className="p-2 tabular-nums">{d.questionCount}</td>
                        <td className="p-2">{d.ready ? 'Yes' : 'No'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold mb-4">Recent Applications</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {applications.length === 0 && (
              <div className="text-sm text-muted-foreground">No application history yet.</div>
            )}
            {applications.map(a => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-semibold">{a.userName}</div>
                  <div className="text-xs text-muted-foreground">{a.jobTitle}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-secondary">{a.status}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminHome;
