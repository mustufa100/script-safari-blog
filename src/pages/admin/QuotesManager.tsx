import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface Quote { id: string; text: string; author: string; category: string; is_featured: boolean; }

export default function QuotesManager() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('motivational');
  const [isFeatured, setIsFeatured] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
    if (data) setQuotes(data);
  };
  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!text.trim() || !author.trim()) return;
    const { error } = await supabase.from('quotes').insert({ text, author, category, is_featured: isFeatured });
    if (error) { toast.error(error.message); return; }
    toast.success('Quote added'); setDialogOpen(false); setText(''); setAuthor(''); fetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('quotes').delete().eq('id', id);
    toast.success('Deleted'); fetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-foreground">Quotes</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button className="bg-gradient-to-r from-primary to-accent"><Plus className="h-4 w-4 mr-2" />Add Quote</Button></DialogTrigger>
          <DialogContent className="glass-strong border-border">
            <DialogHeader><DialogTitle className="font-display">Add Quote</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Quote Text</Label><Textarea value={text} onChange={e => setText(e.target.value)} className="bg-muted/50" /></div>
              <div><Label>Author</Label><Input value={author} onChange={e => setAuthor(e.target.value)} className="bg-muted/50" /></div>
              <div><Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['motivational', 'success', 'life', 'islamic', 'entrepreneur'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2"><Switch checked={isFeatured} onCheckedChange={setIsFeatured} /><Label>Featured</Label></div>
              <Button onClick={handleSave} className="w-full bg-gradient-to-r from-primary to-accent">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {quotes.map((q, i) => (
          <motion.div key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
            className="glass p-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-foreground italic">"{q.text}"</p>
              <p className="text-sm text-muted-foreground mt-1">— {q.author} · {q.category}{q.is_featured && <Star className="inline h-3 w-3 ml-2 text-secondary" />}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(q.id)} className="text-destructive shrink-0"><Trash2 className="h-4 w-4" /></Button>
          </motion.div>
        ))}
        {quotes.length === 0 && <p className="text-center text-muted-foreground py-12">No quotes yet.</p>}
      </div>
    </div>
  );
}
