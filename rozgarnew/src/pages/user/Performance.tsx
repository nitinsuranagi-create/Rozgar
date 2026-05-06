import DashboardLayout from '@/components/DashboardLayout';
import { Application } from '@/lib/mockData';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';
import { TrendingUp, Target, AlertCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { fetchApplications } from '@/lib/applicationsApi';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Performance = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setApps(await fetchApplications());
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const attempts = useMemo(
    () => apps
      .filter((a) => a.userId === user?.id && a.score != null && (a.status === 'Pass' || a.status === 'Fail' || a.status === 'Accepted' || a.status === 'Rejected'))
      .map((a) => ({ ...a, score: a.score ?? 0 })),
    [apps, user?.id]
  );

  const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
  const passCount = attempts.filter((a) => a.status === 'Pass' || a.status === 'Accepted').length;
  const failCount = attempts.filter((a) => a.status === 'Fail' || a.status === 'Rejected').length;
  const totalTests = attempts.length;
  const successRate = totalTests ? Math.round((passCount / totalTests) * 100) : 0;
  const failureRate = totalTests ? Math.round((failCount / totalTests) * 100) : 0;

  const chartData = attempts.map((a, idx) => ({
    attempt: `T${idx + 1}`,
    score: a.score,
    job: a.jobTitle,
  }));

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-2">Your Performance</h1>
      <p className="text-muted-foreground mb-6">Track your progress and improve your hire rate.</p>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: TrendingUp, label: 'Total Score', val: String(totalScore), sub: `${totalTests} tests attempted`, tone: 'bg-primary/15 text-primary' },
          { icon: Target, label: 'Success Rate', val: `${successRate}%`, sub: `${passCount} of ${totalTests} tests passed`, tone: 'bg-success/15 text-success' },
          { icon: AlertCircle, label: 'Failure Rate', val: `${failureRate}%`, sub: `${failCount} of ${totalTests} tests failed`, tone: 'bg-destructive/15 text-destructive' },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6">
            <div className={`w-10 h-10 rounded-xl grid place-items-center mb-4 ${s.tone}`}><s.icon className="w-5 h-5"/></div>
            <div className="text-3xl font-bold mb-1">{s.val}</div>
            <div className="text-sm font-semibold">{s.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-bold mb-4">Score over time</h3>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading performance data...</div>
        ) : chartData.length === 0 ? (
          <div className="text-sm text-muted-foreground">No completed tests yet.</div>
        ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
              <XAxis dataKey="attempt" stroke="hsl(var(--muted-foreground))" fontSize={12}/>
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12 }}/>
              <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#g)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default Performance;
