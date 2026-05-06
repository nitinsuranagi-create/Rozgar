import AdminLayout from '@/components/AdminLayout';
import { Application } from '@/lib/mockData';
import { decideApplication, fetchApplications } from '@/lib/applicationsApi';
import { Button } from '@/components/ui/button';
import { Check, X, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Applications = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const pending = apps.filter(a => a.status === 'Pass');
  const history = apps.filter(a => a.status === 'Accepted' || a.status === 'Rejected' || a.status === 'Fail');

  useEffect(() => {
    const load = async () => {
      try {
        setApps(await fetchApplications());
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load applications');
      }
    };
    load();
  }, []);

  const decide = async (id: string, status: 'Accepted' | 'Rejected') => {
    try {
      await decideApplication(id, status);
      setApps(p => p.map(a => a.id === id ? { ...a, status } : a));
      toast.success(`Application ${status.toLowerCase()}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update application');
    }
  };

  const badge = (s: string) => {
    if (s === 'Accepted') return <span className="px-2 py-0.5 rounded-full bg-success/15 text-success text-xs font-semibold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/>{s}</span>;
    if (s === 'Rejected' || s === 'Fail') return <span className="px-2 py-0.5 rounded-full bg-destructive/15 text-destructive text-xs font-semibold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/>{s}</span>;
    return <span className="px-2 py-0.5 rounded-full bg-warning/15 text-warning text-xs font-semibold flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/>{s}</span>;
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-2">Applications</h1>
      <p className="text-muted-foreground mb-6">Review worker applications and decide who to hire.</p>
      <h2 className="font-bold text-xl mb-4">Awaiting your decision ({pending.length})</h2>
      <div className="space-y-3 mb-10">
        {pending.length === 0 && <div className="text-muted-foreground text-sm">No pending decisions.</div>}
        {pending.map(a => (
          <div key={a.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-warm grid place-items-center text-primary-foreground font-bold">{a.userName[0]}</div>
              <div>
                <div className="font-semibold">{a.userName}</div>
                <div className="text-sm text-muted-foreground">{a.jobTitle}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {a.userEmail} {a.village ? `• ${a.village}` : ''} {a.userExperience ? `• ${a.userExperience}` : ''}
                </div>
                {a.userSkills && a.userSkills.length > 0 && (
                  <div className="text-xs text-success mt-0.5">Skills: {a.userSkills.join(', ')}</div>
                )}
                <div className="text-xs text-primary mt-0.5">Score: {a.score ?? 0}%</div>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={() => decide(a.id, 'Accepted')} className="bg-success hover:bg-success/90 text-primary-foreground flex-1 sm:flex-none"><Check className="w-4 h-4 mr-1"/> Hire</Button>
              <Button onClick={() => decide(a.id, 'Rejected')} variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 flex-1 sm:flex-none"><X className="w-4 h-4 mr-1"/> Reject</Button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-bold text-xl mb-4">History</h2>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left">
            <tr><th className="p-3">Worker</th><th className="p-3">Job</th><th className="p-3">Contact</th><th className="p-3">Score</th><th className="p-3">Status</th><th className="p-3">Applied</th></tr>
          </thead>
          <tbody>
            {history.slice(0, 10).map(a => (
              <tr key={a.id} className="border-t border-border">
                <td className="p-3 font-medium">{a.userName}</td>
                <td className="p-3 text-muted-foreground">{a.jobTitle}</td>
                <td className="p-3">{a.userEmail || '—'}</td>
                <td className="p-3 tabular-nums">{a.score != null ? `${a.score}%` : '—'}</td>
                <td className="p-3">{badge(a.status)}</td>
                <td className="p-3 text-muted-foreground">{a.appliedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};
export default Applications;
