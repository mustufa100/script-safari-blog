import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Quiz { id: string; title: string; slug: string; description: string | null; category: string; time_limit: number | null; is_active: boolean; }

export default function QuizzesManager() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('knowledge');
  const [timeLimit, setTimeLimit] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetch = async () => {
    const { data } = await supabase.from('quizzes').select('*').order('created_at', { ascending: false });
    if (data) setQuizzes(data);
  };
  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!title.trim()) return;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { error } = await supabase.from('quizzes').insert({
      title, slug, description, category, is_active: isActive,
      time_limit: timeLimit ? parseInt(timeLimit) : null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Quiz created'); setDialogOpen(false); setTitle(''); setDescription(''); fetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('quizzes').delete().eq('id', id);
    toast.success('Deleted'); fetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-foreground">Quizzes</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button className="bg-gradient-to-r from-primary to-accent"><Plus className="h-4 w-4 mr-2" />Create Quiz</Button></DialogTrigger>
          <DialogContent className="glass-strong border-border">
            <DialogHeader><DialogTitle className="font-display">Create Quiz</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} className="bg-muted/50" /></div>
              <div><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} className="bg-muted/50" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
                    <SelectContent>{['personality', 'tech', 'knowledge', 'weekly'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Time Limit (seconds)</Label><Input type="number" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} className="bg-muted/50" placeholder="Optional" /></div>
              </div>
              <div className="flex items-center gap-2"><Switch checked={isActive} onCheckedChange={setIsActive} /><Label>Active</Label></div>
              <Button onClick={handleSave} className="w-full bg-gradient-to-r from-primary to-accent">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {quizzes.map((q, i) => (
          <motion.div key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
            className="glass p-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-foreground">{q.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">{q.category}</Badge>
                {q.time_limit && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{q.time_limit}s</span>}
                <Badge variant={q.is_active ? 'default' : 'secondary'} className="text-xs">{q.is_active ? 'Active' : 'Inactive'}</Badge>
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(q.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </motion.div>
        ))}
        {quizzes.length === 0 && <p className="text-center text-muted-foreground py-12">No quizzes yet.</p>}
      </div>
    </div>
  );
}
