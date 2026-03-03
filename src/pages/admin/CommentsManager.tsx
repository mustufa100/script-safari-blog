import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Trash2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Comment { id: string; content: string; status: string; created_at: string; }

export default function CommentsManager() {
  const [comments, setComments] = useState<Comment[]>([]);

  const fetch = async () => {
    const { data } = await supabase.from('comments').select('id, content, status, created_at').order('created_at', { ascending: false });
    if (data) setComments(data);
  };
  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('comments').update({ status }).eq('id', id);
    toast.success(`Comment ${status}`); fetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('comments').delete().eq('id', id);
    toast.success('Deleted'); fetch();
  };

  const statusColor = (s: string) => {
    if (s === 'approved') return 'default';
    if (s === 'rejected' || s === 'spam') return 'destructive';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-foreground">Comments</h1>
      <div className="space-y-2">
        {comments.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
            className="glass p-4 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm">{c.content}</p>
              <Badge variant={statusColor(c.status)} className="mt-2 text-xs">{c.status}</Badge>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button size="icon" variant="ghost" onClick={() => updateStatus(c.id, 'approved')} title="Approve"><Check className="h-4 w-4 text-green-500" /></Button>
              <Button size="icon" variant="ghost" onClick={() => updateStatus(c.id, 'rejected')} title="Reject"><X className="h-4 w-4 text-destructive" /></Button>
              <Button size="icon" variant="ghost" onClick={() => updateStatus(c.id, 'spam')} title="Spam"><AlertTriangle className="h-4 w-4 text-secondary" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(c.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </motion.div>
        ))}
        {comments.length === 0 && <p className="text-center text-muted-foreground py-12">No comments yet.</p>}
      </div>
    </div>
  );
}
