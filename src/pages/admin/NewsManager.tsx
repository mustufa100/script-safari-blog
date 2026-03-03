import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface News { id: string; title: string; slug: string; category: string; is_breaking: boolean; status: string; created_at: string; }

export default function NewsManager() {
  const [news, setNews] = useState<News[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('tech');
  const [isBreaking, setIsBreaking] = useState(false);
  const [status, setStatus] = useState('draft');

  const fetch = async () => {
    const { data } = await supabase.from('news').select('id, title, slug, category, is_breaking, status, created_at').order('created_at', { ascending: false });
    if (data) setNews(data);
  };
  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!title.trim()) return;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { error } = await supabase.from('news').insert({
      title, slug, content, category, is_breaking: isBreaking, status,
      ...(status === 'published' ? { published_at: new Date().toISOString() } : {}),
    });
    if (error) { toast.error(error.message); return; }
    toast.success('News added'); setDialogOpen(false); setTitle(''); setContent(''); fetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('news').delete().eq('id', id);
    toast.success('Deleted'); fetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-foreground">News</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button className="bg-gradient-to-r from-primary to-accent"><Plus className="h-4 w-4 mr-2" />Add News</Button></DialogTrigger>
          <DialogContent className="glass-strong border-border max-w-xl">
            <DialogHeader><DialogTitle className="font-display">Add News</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} className="bg-muted/50" /></div>
              <div><Label>Content</Label><Textarea value={content} onChange={e => setContent(e.target.value)} className="bg-muted/50 min-h-[120px]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
                    <SelectContent>{['tech', 'startup', 'global', 'crypto'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2"><Switch checked={isBreaking} onCheckedChange={setIsBreaking} /><Label>Breaking News</Label></div>
              <Button onClick={handleSave} className="w-full bg-gradient-to-r from-primary to-accent">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {news.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
            className="glass p-4 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-foreground truncate">{n.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">{n.category}</Badge>
                <Badge variant={n.status === 'published' ? 'default' : 'secondary'} className="text-xs">{n.status}</Badge>
                {n.is_breaking && <Badge className="bg-destructive/20 text-destructive text-xs"><Zap className="h-3 w-3 mr-1" />Breaking</Badge>}
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(n.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </motion.div>
        ))}
        {news.length === 0 && <p className="text-center text-muted-foreground py-12">No news yet.</p>}
      </div>
    </div>
  );
}
