import AdminLayout from '@/components/AdminLayout';
import { createJob, fetchJobs } from '@/lib/jobsApi';
import { Job } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, MapPin, IndianRupee, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const Works = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState({ title: '', category: '', location: '', pay: '', description: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load jobs');
      }
    };
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category) return toast.error('Fill all fields');
    try {
      const created = await createJob({
        ...form,
        type: 'Full-time',
        postedBy: user?.name || 'Admin',
        skills: [form.category],
      });
      setJobs(j => [created, ...j]);
      toast.success('Job posted!');
      setOpen(false);
      setForm({ title: '', category: '', location: '', pay: '', description: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to post job');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">All Jobs</h1>
          <p className="text-muted-foreground">{jobs.length} active listings</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground"><Plus className="w-4 h-4 mr-2"/> Post Job</Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-card rounded-2xl p-6 w-full max-w-lg border border-border" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Post a new job</h2>
            <form onSubmit={create} className="space-y-3">
              <div><Label>Title</Label><Input className="mt-1.5" value={form.title} onChange={e => setForm(f=>({...f, title: e.target.value}))}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label><Input className="mt-1.5" value={form.category} onChange={e => setForm(f=>({...f, category: e.target.value}))}/></div>
                <div><Label>Location</Label><Input className="mt-1.5" value={form.location} onChange={e => setForm(f=>({...f, location: e.target.value}))}/></div>
              </div>
              <div><Label>Pay</Label><Input className="mt-1.5" value={form.pay} onChange={e => setForm(f=>({...f, pay: e.target.value}))} placeholder="₹12,000/mo"/></div>
              <div><Label>Description</Label><Textarea className="mt-1.5" rows={3} value={form.description} onChange={e => setForm(f=>({...f, description: e.target.value}))}/></div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">Publish</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map(j => (
          <div key={j.id} className="bg-card border border-border rounded-2xl p-5">
            <span className="text-xs font-semibold text-accent uppercase">{j.category}</span>
            <h3 className="text-lg font-bold mt-1 mb-2">{j.title}</h3>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{j.location}</span>
              <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3"/>{j.pay}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3"/>{j.applicants}</span>
            </div>
            <div className="text-xs text-muted-foreground">Posted {j.postedAt}</div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};
export default Works;
