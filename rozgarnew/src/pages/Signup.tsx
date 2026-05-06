import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sprout, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, Role } from '@/context/AuthContext';
import { toast } from 'sonner';
import heroImg from '@/assets/rural-hero.jpg';

const SKILL_OPTIONS = ['Farming', 'Dairy', 'Masonry', 'Plumbing', 'Electrical', 'Tailoring', 'Driving', 'Pottery', 'Beekeeping', 'Fishing', 'Animal Care', 'Cooking', 'Weaving'];

const Signup = () => {
  const [params] = useSearchParams();
  const [role, setRole] = useState<Role>((params.get('role') as Role) || 'user');
  const [form, setForm] = useState({ name: '', email: '', pwd: '', location: '', age: '', dob: '', experience: '' });
  const [skills, setSkills] = useState<string[]>([]);
  const { signup } = useAuth();
  const nav = useNavigate();

  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const toggleSkill = (s: string) => setSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.pwd) return toast.error('Fill required fields');
    if (role === 'user' && skills.length === 0) return toast.error('Select at least one skill');
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.pwd,
        role,
        location: form.location,
        age: form.age ? +form.age : undefined,
        dob: form.dob,
        experience: form.experience,
        skills,
      });
      toast.success('Account created! Welcome to ROZGAR');
      nav(role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 md:p-12 bg-background order-2 lg:order-1">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-gradient-field grid place-items-center"><Sprout className="w-5 h-5 text-primary-foreground" /></div>
            <span className="text-xl font-bold">ROZGAR</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Join ROZGAR</h1>
          <p className="text-muted-foreground mb-6">Create your free account in 30 seconds.</p>

          <div className="grid grid-cols-2 p-1 bg-secondary rounded-xl mb-6">
            {(['user', 'admin'] as Role[]).map(r => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`py-2 rounded-lg text-sm font-semibold transition ${role === r ? 'bg-card shadow-soft' : 'text-muted-foreground'}`}>
                {r === 'user' ? "I'm a Worker" : "I'm hiring (Admin)"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Full Name</Label><Input value={form.name} onChange={e => upd('name', e.target.value)} className="mt-1.5 h-11" placeholder="Ramesh K." /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => upd('email', e.target.value)} className="mt-1.5 h-11" placeholder="you@example.in" /></div>
            </div>
            <div><Label>Location</Label><Input value={form.location} onChange={e => upd('location', e.target.value)} className="mt-1.5 h-11" placeholder="Village, District, State" /></div>
            <div><Label>Password</Label><Input type="password" value={form.pwd} onChange={e => upd('pwd', e.target.value)} className="mt-1.5 h-11" placeholder="At least 6 characters" /></div>

            {role === 'user' && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Age</Label><Input type="number" value={form.age} onChange={e => upd('age', e.target.value)} className="mt-1.5 h-11" placeholder="25" /></div>
                  <div className="col-span-2"><Label>DOB</Label><Input type="date" value={form.dob} onChange={e => upd('dob', e.target.value)} className="mt-1.5 h-11" /></div>
                </div>
                <div><Label>Experience</Label><Input value={form.experience} onChange={e => upd('experience', e.target.value)} className="mt-1.5 h-11" placeholder="e.g. 3 years in farming" /></div>
                <div>
                  <Label>Your Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {SKILL_OPTIONS.map(s => (
                      <button type="button" key={s} onClick={() => toggleSkill(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${skills.includes(s) ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:border-primary/50'}`}>
                        {s} {skills.includes(s) && <X className="w-3 h-3 inline ml-1" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground mt-2">Create Account</Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
      <div className="relative hidden lg:block order-1 lg:order-2">
        <img src={heroImg} alt="Rural India" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-bl from-accent/70 via-primary/40 to-primary/80" />
        <div className="relative z-10 p-12 h-full flex items-end text-primary-foreground">
          <div>
            <h2 className="text-5xl font-bold mb-3 leading-tight">Build dignity<br/>through skill.</h2>
            <p className="text-primary-foreground/90 max-w-md">Join 12,000+ verified workers earning fairly across rural India.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;
