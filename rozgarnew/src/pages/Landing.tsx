import { Link } from 'react-router-dom';
import { Sprout, Briefcase, Brain, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImg from '@/assets/rural-hero.jpg';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-field grid place-items-center shadow-soft">
              <Sprout className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">ROZGAR</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition">Features</a>
            <a href="#how" className="hover:text-primary transition">How it works</a>
            <a href="#stats" className="hover:text-primary transition">Impact</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost">Login</Button></Link>
            <Link to="/signup"><Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 rural-pattern opacity-40" />
        <div className="container relative grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold mb-6">
              <Sparkles className="w-3 h-3" /> AI-powered rural workforce platform
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              Real <span className="text-primary">Skills.</span><br />
              Real <span className="text-accent">Work.</span><br />
              Real <span className="italic">Bharat.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8">
              ROZGAR connects rural India's workforce with verified opportunities through skill-based testing,
              transparent hiring and AI matching. From farms to factories — your kaam, your pehchaan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/signup"><Button size="lg" className="bg-primary hover:bg-primary/90 shadow-warm">
                Find Work <ArrowRight className="ml-2 w-4 h-4" />
              </Button></Link>
              <Link to="/signup?role=admin"><Button size="lg" variant="outline">Post a Job</Button></Link>
            </div>
            <div className="flex items-center gap-8 mt-12 text-sm">
              <div><div className="text-2xl font-bold text-primary">12k+</div><div className="text-muted-foreground">Workers</div></div>
              <div className="w-px h-10 bg-border" />
              <div><div className="text-2xl font-bold text-primary">800+</div><div className="text-muted-foreground">Villages</div></div>
              <div className="w-px h-10 bg-border" />
              <div><div className="text-2xl font-bold text-primary">95%</div><div className="text-muted-foreground">Match rate</div></div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-warm rounded-3xl opacity-20 blur-2xl" />
            <img src={heroImg} alt="Rural India workforce illustration" width={1536} height={1024}
              className="relative rounded-3xl shadow-warm border-4 border-card" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-24">
        <div className="max-w-2xl mb-12">
          <p className="text-accent font-semibold text-sm uppercase tracking-wide mb-2">Why ROZGAR</p>
          <h2 className="text-4xl md:text-5xl font-bold">Built for the soil, made for the future.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Briefcase, title: 'Verified Job Posts', desc: 'Every listing reviewed. No fake recruiters, no surprise fees.' },
            { icon: Brain, title: 'Skill-First Tests', desc: 'Show what you know — quick MCQ tests prove your craft.' },
            { icon: Sparkles, title: 'AI Match Saathi', desc: 'Tell our chatbot your skill — get the right job in seconds.' },
          ].map((f, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all hover:-translate-y-1 shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-gradient-field grid place-items-center mb-5 group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="bg-secondary/40 py-24">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">How it works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { n: '01', t: 'Sign up', d: 'Tell us your skills, age & experience.' },
              { n: '02', t: 'Browse jobs', d: 'Filter by location, pay or category.' },
              { n: '03', t: 'Take the test', d: 'Quick skill MCQ. Pass to qualify.' },
              { n: '04', t: 'Get hired', d: 'Admin reviews & confirms your role.' },
            ].map((s) => (
              <div key={s.n} className="bg-card rounded-2xl p-6 border border-border">
                <div className="text-5xl font-bold text-accent/30 mb-2">{s.n}</div>
                <h4 className="font-bold text-lg mb-1">{s.t}</h4>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="stats" className="container py-24">
        <div className="rounded-3xl bg-gradient-field p-12 md:p-16 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 rural-pattern opacity-20" />
          <div className="relative max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to find work that fits?</h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Join thousands of rural workers finding dignified employment every day.
            </p>
            <Link to="/signup"><Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-warm">
              Create Free Account <ArrowRight className="ml-2 w-4 h-4" />
            </Button></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-primary" />
            <span>© 2026 ROZGAR — Built for Bharat</span>
          </div>
          <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> Made with love across 28 states</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
