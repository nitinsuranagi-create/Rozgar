import DashboardLayout from '@/components/DashboardLayout';
import JobCard from '@/components/JobCard';
import { Application, Job } from '@/lib/mockData';
import { fetchJobs } from '@/lib/jobsApi';
import { fetchApplications } from '@/lib/applicationsApi';
import { Briefcase, Eye, Clock } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const stat = (icon: any, label: string, val: string, tone: string) => {
  const Icon = icon;
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl grid place-items-center ${tone}`}><Icon className="w-5 h-5"/></div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold">{val}</div>
      </div>
    </div>
  );
};

const Section = ({ title, jobs }: { title: string; jobs: any[] }) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    {jobs.length === 0 ? (
      <div className="bg-card border border-dashed border-border rounded-2xl p-10 text-center text-muted-foreground">No items yet.</div>
    ) : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map(j => <JobCard key={j.id} job={j} compact />)}
      </div>
    )}
  </section>
);

const NamasteIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10.7 4.2c-.5-1-1.9-1-2.4 0L6.2 8.5c-.3.6-.2 1.3.2 1.8l2.3 2.7c.5.6 1.4.6 1.9 0l2.3-2.7c.4-.5.5-1.2.2-1.8L10.7 4.2Z" fill="currentColor"/>
    <path d="M15.7 4.2c-.5-1-1.9-1-2.4 0l-2.4 4.9c-.3.6-.2 1.3.2 1.8l3.2 3.9c.6.7 1.7.7 2.3 0l2.2-2.7c.4-.5.5-1.2.2-1.8l-3.3-6.1Z" fill="currentColor"/>
    <path d="M7 13.8 3.8 10c-.6-.7-1.7-.7-2.3 0l-.8 1c-.5.6-.5 1.4 0 2l4.7 5.7c.4.5 1 .8 1.6.8h10c.6 0 1.2-.3 1.6-.8l4.7-5.7c.5-.6.5-1.4 0-2l-.8-1c-.6-.7-1.7-.7-2.3 0L17 13.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserHome = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [liveJobs, liveApplications] = await Promise.all([fetchJobs(), fetchApplications()]);
        setJobs(liveJobs);
        setApplications(liveApplications);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load dashboard data');
      }
    };
    load();
  }, []);

  const jobsWithAppliedCount = useMemo(() => {
    const byJobId = new Map<string, number>();
    applications.forEach((a) => {
      byJobId.set(a.jobId, (byJobId.get(a.jobId) || 0) + 1);
    });
    return jobs.map((j) => ({
      ...j,
      applicants: byJobId.get(j.id) ?? 0,
    }));
  }, [jobs, applications]);

  const trendingJobs = useMemo(
    () => jobsWithAppliedCount
      .slice()
      .sort((a, b) => b.applicants - a.applicants)
      .slice(0, 3)
      .map((j) => ({ ...j, trending: true })),
    [jobsWithAppliedCount]
  );
  const recent = useMemo(() => jobsWithAppliedCount.slice(0, 3), [jobsWithAppliedCount]);
  const pendingApplications = useMemo(
    () => applications.filter(a => a.userId === user?.id && (a.status === 'Pending' || a.status === 'Pass')),
    [applications, user?.id]
  );
  const pendingJobs = useMemo(
    () =>
      pendingApplications
        .map((a) => jobsWithAppliedCount.find((j) => j.id === a.jobId))
        .filter((j): j is Job => Boolean(j)),
    [pendingApplications, jobsWithAppliedCount]
  );

  return (
    <DashboardLayout>
      <div className="mb-8 p-6 lg:p-8 rounded-3xl bg-gradient-field text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 rural-pattern opacity-15"/>
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 inline-flex items-center gap-2">
            Namaste <span className="text-primary-foreground/95"><NamasteIcon /></span>
          </h1>
          <p className="opacity-90">Here are today's best matches for you.</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {stat(Briefcase, 'Trending Jobs', `${trendingJobs.length}`, 'bg-primary/15 text-primary')}
        {stat(Eye, 'Recently Viewed', `${recent.length}`, 'bg-accent/15 text-accent')}
        {stat(Clock, 'Pending Applications', `${pendingApplications.length}`, 'bg-warning/15 text-warning')}
      </div>
      <Section title="🔥 Trending Jobs" jobs={trendingJobs} />
      <Section title="👀 Recently Visited" jobs={recent} />
      <Section title="⏳ Pending Applied Jobs" jobs={pendingJobs} />
    </DashboardLayout>
  );
};
export default UserHome;
