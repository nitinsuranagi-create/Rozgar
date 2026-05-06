import DashboardLayout from '@/components/DashboardLayout';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { fetchApplications } from '@/lib/applicationsApi';
import { Application } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const badge = (s: string) => {
  if (s === 'Pass') return <span className="px-3 py-1 rounded-full bg-success/15 text-success text-xs font-semibold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/> Passed</span>;
  if (s === 'Fail') return <span className="px-3 py-1 rounded-full bg-destructive/15 text-destructive text-xs font-semibold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> Failed</span>;
  return <span className="px-3 py-1 rounded-full bg-warning/15 text-warning text-xs font-semibold flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> Pending</span>;
};

const Result = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const last = JSON.parse(localStorage.getItem('rozgar_last_result') || 'null');

  useEffect(() => {
    const load = async () => {
      try {
        setApps(await fetchApplications());
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load test history');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const history = useMemo(
    () => apps
      .filter((a) => a.userId === user?.id && a.score != null && (a.status === 'Pass' || a.status === 'Fail' || a.status === 'Accepted' || a.status === 'Rejected'))
      .slice(0, 10),
    [apps, user?.id]
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-2">Test Results</h1>
      <p className="text-muted-foreground mb-6">Your latest and previous attempts.</p>
      <div className="bg-gradient-field text-primary-foreground rounded-2xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 rural-pattern opacity-15"/>
        <div className="relative">
          <div className="text-xs uppercase opacity-80 mb-1">Last Applied Job</div>
          <h2 className="text-2xl font-bold mb-2">{last?.job || 'No tests taken yet'}</h2>
          {last && (
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold">{last.score}%</div>
              <span className="px-3 py-1 rounded-full bg-card/20 text-xs font-semibold">{last.status}</span>
            </div>
          )}
        </div>
      </div>
      <h3 className="font-bold mb-4">Previous tests</h3>
      <div className="space-y-3">
        {!loading && history.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-4 text-sm text-muted-foreground">
            No previous test records found.
          </div>
        )}
        {history.map((h) => (
          <div key={h.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="font-semibold">{h.jobTitle}</div>
              <div className="text-xs text-muted-foreground">{h.appliedAt}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold tabular-nums">{h.score}%</div>
              {badge(h.status)}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};
export default Result;
