import DashboardLayout from '@/components/DashboardLayout';
import JobCard from '@/components/JobCard';
import { Job } from '@/lib/mockData';
import { fetchJobs } from '@/lib/jobsApi';
import { Search } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const Jobs = () => {
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setJobs(await fetchJobs());
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load jobs');
      }
    };
    load();
  }, []);

  const userLocation = (user?.location || '').trim().toLowerCase();
  const userSkills = (user?.skills || []).map((s) => s.trim().toLowerCase()).filter(Boolean);

  const recommendedJobs = useMemo(() => {
    return jobs
      .map((job) => {
        const jobLocation = (job.location || '').toLowerCase();
        const jobCategory = (job.category || '').toLowerCase();
        const jobTitle = (job.title || '').toLowerCase();
        const jobSkills = (job.skills || []).map((s) => s.toLowerCase());

        const locationMatch = userLocation && (jobLocation.includes(userLocation) || userLocation.includes(jobLocation)) ? 1 : 0;
        const skillMatches = userSkills.filter((skill) =>
          jobSkills.some((jobSkill) => jobSkill.includes(skill) || skill.includes(jobSkill)) ||
          jobTitle.includes(skill) ||
          jobCategory.includes(skill)
        ).length;

        const recommendationScore = (locationMatch * 3) + (skillMatches * 2) + (job.applicants > 0 ? 1 : 0);
        return { ...job, recommendationScore, locationMatch, skillMatches };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore || b.applicants - a.applicants);
  }, [jobs, userLocation, userSkills]);

  const bestMatches = useMemo(
    () =>
      recommendedJobs
        .filter((j) => j.locationMatch > 0 || j.skillMatches > 0)
        .slice(0, 6),
    [recommendedJobs]
  );

  const cats = ['All', ...Array.from(new Set(jobs.map(j => j.category)))];
  const searchFilter = (j: (typeof recommendedJobs)[0]) =>
    (cat === 'All' || j.category === cat) &&
    (j.title.toLowerCase().includes(q.toLowerCase()) || j.location.toLowerCase().includes(q.toLowerCase()) || j.skills.some(s => s.toLowerCase().includes(q.toLowerCase())));

  /** Jobs that match profile (skill and/or location) — shown in order of relevance */
  const profileMatchedJobs = useMemo(
    () => recommendedJobs.filter((j) => j.locationMatch > 0 || j.skillMatches > 0).filter(searchFilter),
    [recommendedJobs, cat, q]
  );

  /** Full list for browsing (search + category); includes both matched and unmatched */
  const allJobsFiltered = useMemo(
    () => recommendedJobs.filter(searchFilter),
    [recommendedJobs, cat, q]
  );
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-2">Find Work</h1>
      <p className="text-muted-foreground mb-6">{jobs.length} verified opportunities across rural India, ranked for your profile.</p>
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by title, location or skill…" className="pl-11 h-12 bg-card"/>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition ${cat === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:border-primary/40'}`}>
            {c}
          </button>
        ))}
      </div>
      {bestMatches.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-2">Best Matches For You</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Suggested using your profile skills and location.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {bestMatches.map((j) => <JobCard key={`best-${j.id}`} job={j} />)}
          </div>
        </>
      )}
      {profileMatchedJobs.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-2">Matched to your profile</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Ordered by how well each job fits your location and skills.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {profileMatchedJobs.map((j) => (
              <JobCard key={`match-${j.id}`} job={j} />
            ))}
          </div>
        </>
      )}
      <h2 className="text-xl font-bold mb-2">All Jobs</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Every opening that matches your search (includes profile matches and other roles).
      </p>
      {allJobsFiltered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No jobs match your search.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allJobsFiltered.map(j => <JobCard key={j.id} job={j} />)}
        </div>
      )}
    </DashboardLayout>
  );
};
export default Jobs;
