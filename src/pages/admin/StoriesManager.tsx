import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

interface Story { id: string; title: string; thumbnail: string | null; is_active: boolean; expires_at: string | null; created_at: string; }

export default function StoriesManager() {
  const [stories, setStories] = useState<Story[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [editing, setEditing] = useState<Story | null>(null);
  const [thumbnail, setThumbnail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const resetForm = () => { setTitle(''); setThumbnail(''); setIsActive(true); setEditing(null); };

  const fetch = async () => {
    const { data } = await supabase.from('web_stories').select('id, title, thumbnail, is_active, expires_at, created_at').order('created_at', { ascending: false });
    if (data) setStories(data);
  };
  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (uploading || saving) return;
    if (!title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    const payload = { title, is_active: isActive, thumbnail: thumbnail.trim() || null };
    const { error } = editing
      ? await supabase.from('web_stories').update(payload).eq('id', editing.id)
      : await supabase.from('web_stories').insert({ ...payload, slides: [] });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editing ? 'Story updated' : 'Story created'); setDialogOpen(false); resetForm(); fetch();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('web_stories').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted'); fetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-foreground">Web Stories</h1>
        <Dialog open={dialogOpen} onOpenChange={open => { if (uploading || saving) return; setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild><Button className="bg-gradient-to-r from-primary to-accent"><Plus className="h-4 w-4 mr-2" />Create Story</Button></DialogTrigger>
          <DialogContent className="glass-strong border-border">
            <DialogHeader><DialogTitle className="font-display">{editing ? 'Edit Web Story' : 'Create Web Story'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} className="bg-muted/50" /></div>
              <ImageUploadField label="Thumbnail image URL" value={thumbnail} onChange={setThumbnail} folder="web-stories" onBusyChange={setUploading} />
              <div className="flex items-center gap-2"><Switch checked={isActive} onCheckedChange={setIsActive} /><Label>Active</Label></div>
              <Button onClick={handleSave} disabled={uploading || saving} className="w-full bg-gradient-to-r from-primary to-accent">{saving ? 'Saving...' : 'Save'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {stories.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
            className="glass p-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-foreground">{s.title}</h3>
              <Badge variant={s.is_active ? 'default' : 'secondary'} className="text-xs mt-1">{s.is_active ? 'Active' : 'Inactive'}</Badge>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" aria-label={`Edit ${s.title}`} onClick={() => { setEditing(s); setTitle(s.title); setThumbnail(s.thumbnail ?? ''); setIsActive(s.is_active); setDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </motion.div>
        ))}
        {stories.length === 0 && <p className="text-center text-muted-foreground py-12">No stories yet.</p>}
      </div>
    </div>
  );
}
