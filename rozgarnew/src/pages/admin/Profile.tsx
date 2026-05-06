import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminProfile = () => {
  const { user } = useAuth();
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Admin Profile</h1>
      <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-field grid place-items-center text-3xl font-bold text-primary-foreground">{user?.name?.[0]?.toUpperCase() ?? 'A'}</div>
          <div>
            <div className="text-xl font-bold">{user?.name}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent font-semibold">Admin</span>
          </div>
        </div>
        <form onSubmit={e => { e.preventDefault(); toast.success('Saved'); }} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Organization</Label><Input className="mt-1.5" defaultValue="Bharat Co-op" /></div>
            <div><Label>Region</Label><Input className="mt-1.5" defaultValue="North India" /></div>
            <div><Label>Email</Label><Input className="mt-1.5" defaultValue={user?.email}/></div>
            <div><Label>Phone</Label><Input className="mt-1.5" defaultValue="+91 98xxxxxx00"/></div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
        </form>
      </div>
    </AdminLayout>
  );
};
export default AdminProfile;
