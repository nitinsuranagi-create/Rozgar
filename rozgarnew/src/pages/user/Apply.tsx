import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Job } from '@/lib/mockData';
import { fetchJobById } from '@/lib/jobsApi';
import { createApplication } from '@/lib/applicationsApi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Apply = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    village: '',
    exp: user?.experience || '',
    note: '',
  });

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      const found = await fetchJobById(id);
      setJob(found);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <DashboardLayout><div>Loading job details...</div></DashboardLayout>;
  if (!job) return <DashboardLayout><div>Job not found.</div></DashboardLayout>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error('Please login first');
    if (!form.name || !form.phone) return toast.error('Fill required fields');

    try {
      const created = await createApplication({
        jobId: job.id,
        userId: user.id,
        userName: form.name,
        userEmail: user.email,
        userRole: user.role,
        userAge: user.age,
        userDob: user.dob,
        userExperience: form.exp || user.experience,
        userSkills: user.skills || [],
        phone: form.phone,
        village: form.village,
        note: form.note,
      });
      toast.success('Application saved. Start your skill exam now.');
      nav(`/dashboard/exam/${job.id}?applicationId=${created.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit application');
    }
  };

  return (
    <DashboardLayout>
      <button onClick={() => nav(-1)} className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4"/> Back</button>
      <div className="max-w-2xl">
        <span className="text-xs font-semibold text-accent uppercase">{job.category}</span>
        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
        <p className="text-muted-foreground mb-6">{job.description}</p>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-bold mb-4">Job Registration Form</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Full Name *</Label><Input className="mt-1.5" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}/></div>
              <div><Label>Phone *</Label><Input className="mt-1.5" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}/></div>
              <div><Label>Village / Town</Label><Input className="mt-1.5" value={form.village} onChange={e => setForm(f => ({...f, village: e.target.value}))}/></div>
              <div><Label>Years of Experience</Label><Input type="number" className="mt-1.5" value={form.exp} onChange={e => setForm(f => ({...f, exp: e.target.value}))}/></div>
            </div>
            <div><Label>Why are you good for this job?</Label><Textarea className="mt-1.5" rows={3} value={form.note} onChange={e => setForm(f => ({...f, note: e.target.value}))}/></div>
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-sm">
              Your profile details are submitted with this application so admins can review and decide quickly.
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-11">Submit & Start Test</Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default Apply;
