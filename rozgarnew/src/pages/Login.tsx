import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sprout, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, Role } from '@/context/AuthContext';
import { toast } from 'sonner';
import heroImg from '@/assets/rural-hero.jpg';

const Login = () => {
  const [params] = useSearchParams();
  const [role, setRole] = useState<Role>((params.get('role') as Role) || 'user');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pwd) return toast.error('Please fill all fields');
    try {
      await login(email, pwd, role);
      toast.success('Welcome back to ROZGAR');
      nav(role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={heroImg} alt="Rural India" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/40 to-accent/60" />
        <div className="relative z-10 p-12 h-full flex flex-col justify-between text-primary-foreground">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-card/20 backdrop-blur grid place-items-center">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">ROZGAR</span>
          </Link>
          <div>
            <h2 className="text-5xl font-bold mb-3 leading-tight">Apna kaam,<br/>apni pehchaan.</h2>
            <p className="text-primary-foreground/90 max-w-md">Verified rural jobs, skill-based hiring, no middlemen.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-gradient-field grid place-items-center"><Sprout className="w-5 h-5 text-primary-foreground" /></div>
            <span className="text-xl font-bold">ROZGAR</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">Sign in to continue your journey.</p>

          <div className="grid grid-cols-2 p-1 bg-secondary rounded-xl mb-6">
            {(['user', 'admin'] as Role[]).map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`py-2 rounded-lg text-sm font-semibold capitalize transition ${role === r ? 'bg-card shadow-soft text-foreground' : 'text-muted-foreground'}`}>
                {r === 'user' ? 'Worker' : 'Admin'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email or Phone</Label>
              <Input id="email" type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="ramesh@village.in" className="mt-1.5 h-11" />
            </div>
            <div>
              <Label htmlFor="pwd">Password</Label>
              <div className="relative mt-1.5">
                <Input id="pwd" type={show ? 'text' : 'password'} value={pwd} onChange={e => setPwd(e.target.value)} placeholder="••••••••" className="h-11 pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90">Sign in as {role}</Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New here? <Link to="/signup" className="text-primary font-semibold hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
