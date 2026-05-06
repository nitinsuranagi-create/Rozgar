import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '',
    location: user?.location || '',
    age: user?.age?.toString() || '', dob: user?.dob || '',
    experience: user?.experience || '', skills: user?.skills?.join(', ') || ''
  });
  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect backend API
    toast.success('Profile updated');
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-warm grid place-items-center text-3xl font-bold text-primary-foreground">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <div className="text-xl font-bold">{user?.name}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
            {user?.location && <div className="text-sm text-muted-foreground">{user.location}</div>}
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">{user?.role}</span>
          </div>
        </div>
        <form onSubmit={save} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Name</Label><Input className="mt-1.5" value={form.name} onChange={e => upd('name', e.target.value)}/></div>
            <div><Label>Email</Label><Input className="mt-1.5" value={form.email} onChange={e => upd('email', e.target.value)}/></div>
            <div><Label>Location</Label><Input className="mt-1.5" value={form.location} onChange={e => upd('location', e.target.value)}/></div>
            <div><Label>Age</Label><Input type="number" className="mt-1.5" value={form.age} onChange={e => upd('age', e.target.value)}/></div>
            <div><Label>Date of Birth</Label><Input type="date" className="mt-1.5" value={form.dob} onChange={e => upd('dob', e.target.value)}/></div>
          </div>
          <div><Label>Experience</Label><Input className="mt-1.5" value={form.experience} onChange={e => upd('experience', e.target.value)}/></div>
          <div><Label>Skills (comma separated)</Label><Input className="mt-1.5" value={form.skills} onChange={e => upd('skills', e.target.value)}/></div>
          <Button type="submit" className="bg-primary hover:bg-primary/90">Save Changes</Button>
        </form>
      </div>
    </DashboardLayout>
  );
};
export default Profile;
