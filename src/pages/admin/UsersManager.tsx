import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Ban, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile { 
  id: string; 
  user_id: string; 
  display_name: string | null; 
  is_suspended: boolean; 
  created_at: string; 
}

interface UserRole { user_id: string; role: string; }

export default function UsersManager() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<Record<string, string>>({});

  const fetchData = async () => {
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    const { data: roleData } = await supabase.from('user_roles').select('user_id, role');
    if (profiles) setUsers(profiles);
    if (roleData) {
      const map: Record<string, string> = {};
      roleData.forEach((r: UserRole) => { map[r.user_id] = r.role; });
      setRoles(map);
    }
  };
  useEffect(() => { fetchData(); }, []);

  const changeRole = async (userId: string, newRole: string) => {
    if (!isAdmin) { toast.error('Only admins can change roles'); return; }
    const { error } = await supabase.from('user_roles').update({ role: newRole as any }).eq('user_id', userId);
    if (error) toast.error(error.message);
    else { toast.success('Role updated'); fetchData(); }
  };

  const toggleSuspend = async (profile: UserProfile) => {
    if (!isAdmin) return;
    await supabase.from('profiles').update({ is_suspended: !profile.is_suspended }).eq('id', profile.id);
    toast.success(profile.is_suspended ? 'Unsuspended' : 'Suspended');
    fetchData();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-foreground">Users</h1>
      <div className="space-y-2">
        {users.map((u, i) => (
          <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
            className="glass p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-foreground font-bold text-sm">
                {(u.display_name || '?')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-foreground">{u.display_name || 'Unknown'}</p>
                <Badge variant="secondary" className="text-xs mt-1"><Shield className="h-3 w-3 mr-1" />{roles[u.user_id] || 'user'}</Badge>
                {u.is_suspended && <Badge variant="destructive" className="text-xs ml-2">Suspended</Badge>}
              </div>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Select value={roles[u.user_id] || 'user'} onValueChange={(v: string) => changeRole(u.user_id, v)}>
                  <SelectTrigger className="w-28 bg-muted/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['admin', 'editor', 'writer', 'user'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button size="icon" variant="ghost" onClick={() => toggleSuspend(u)}>
                  <Ban className={`h-4 w-4 ${u.is_suspended ? 'text-green-500' : 'text-destructive'}`} />
                </Button>
              </div>
            )}
          </motion.div>
        ))}
        {users.length === 0 && <p className="text-center text-muted-foreground py-12">No users yet.</p>}
      </div>
    </div>
  );
}
