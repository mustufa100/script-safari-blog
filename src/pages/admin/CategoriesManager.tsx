import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Category { id: string; name: string; slug: string; color: string; parent_id: string | null; }

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#8B5CF6');

  const fetch = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };
  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (editing) {
      const { error } = await supabase.from('categories').update({ name, slug, color }).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Category updated');
    } else {
      const { error } = await supabase.from('categories').insert({ name, slug, color });
      if (error) { toast.error(error.message); return; }
      toast.success('Category created');
    }
    setDialogOpen(false); setName(''); setColor('#8B5CF6'); setEditing(null); fetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('categories').delete().eq('id', id);
    toast.success('Deleted'); fetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-foreground">Categories</h1>
        <Dialog open={dialogOpen} onOpenChange={o => { setDialogOpen(o); if (!o) { setEditing(null); setName(''); } }}>
          <DialogTrigger asChild><Button className="bg-gradient-to-r from-primary to-accent"><Plus className="h-4 w-4 mr-2" />Add Category</Button></DialogTrigger>
          <DialogContent className="glass-strong border-border">
            <DialogHeader><DialogTitle className="font-display">{editing ? 'Edit' : 'Create'} Category</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} className="bg-muted/50" /></div>
              <div><Label>Color</Label><div className="flex gap-2"><Input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-16 h-10 p-1" /><Input value={color} onChange={e => setColor(e.target.value)} className="bg-muted/50" /></div></div>
              <Button onClick={handleSave} className="w-full bg-gradient-to-r from-primary to-accent">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="font-medium text-foreground">{cat.name}</span>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => { setEditing(cat); setName(cat.name); setColor(cat.color); setDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(cat.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </motion.div>
        ))}
        {categories.length === 0 && <p className="text-muted-foreground col-span-full text-center py-12">No categories yet.</p>}
      </div>
    </div>
  );
}
