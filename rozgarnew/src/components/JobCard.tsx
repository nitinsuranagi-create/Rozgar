import { Job } from '@/lib/mockData';
import { MapPin, IndianRupee, Users, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function JobCard({ job, compact = false }: { job: Job; compact?: boolean }) {
  const nav = useNavigate();
  return (
    <div className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-soft transition-all hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-accent uppercase tracking-wide">{job.category}</span>
          <h3 className="text-lg font-bold mt-1 group-hover:text-primary transition">{job.title}</h3>
        </div>
        {job.trending && <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-accent/15 text-accent">🔥 Trending</span>}
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{job.location}</span>
        <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3"/>{job.pay}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{job.type}</span>
      </div>
      {!compact && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3"/>{job.applicants} applied</span>
        <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => nav(`/dashboard/apply/${job.id}`)}>
          Apply <ArrowRight className="w-3 h-3 ml-1"/>
        </Button>
      </div>
    </div>
  );
}
