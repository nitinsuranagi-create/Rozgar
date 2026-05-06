import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Briefcase, BarChart3, ClipboardCheck, User, LogOut, Sprout, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ReactNode, useState } from 'react';
import Chatbot from './Chatbot';
import { Button } from '@/components/ui/button';

const items = [
  { to: '/dashboard', label: 'Home', icon: Home, end: true },
  { to: '/dashboard/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/dashboard/performance', label: 'Performance', icon: BarChart3 },
  { to: '/dashboard/result', label: 'Result', icon: ClipboardCheck },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [chatOpen, setChat] = useState(false);
  const [mobileNav, setMobile] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform ${mobileNav ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 px-6 flex items-center gap-2 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg bg-gradient-field grid place-items-center"><Sprout className="w-5 h-5 text-primary-foreground" /></div>
          <span className="text-xl font-bold">ROZGAR</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {items.map(it => (
            <NavLink key={it.to} to={it.to} end={it.end} onClick={() => setMobile(false)}
              className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-primary text-primary-foreground shadow-soft' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}>
              <it.icon className="w-4 h-4" /> {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-warm grid place-items-center text-primary-foreground font-bold">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{user?.name}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={() => { logout(); nav('/'); }}>
            <LogOut className="w-3.5 h-3.5 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 px-4 lg:px-8 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
          <button className="lg:hidden p-2" onClick={() => setMobile(!mobileNav)}>
            <div className="w-5 h-0.5 bg-foreground mb-1"/>
            <div className="w-5 h-0.5 bg-foreground mb-1"/>
            <div className="w-5 h-0.5 bg-foreground"/>
          </button>
          <h1 className="text-lg font-semibold capitalize">
            {loc.pathname.split('/').pop() || 'Home'}
          </h1>
          <Button onClick={() => setChat(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
            <MessageCircle className="w-4 h-4"/> <span className="hidden sm:inline">Saathi AI</span>
          </Button>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">{children}</main>
      </div>

      <Chatbot open={chatOpen} onClose={() => setChat(false)} />
    </div>
  );
};
export default DashboardLayout;
