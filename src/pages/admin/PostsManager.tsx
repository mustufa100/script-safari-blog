import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  is_featured: boolean;
  reading_time: number;
  views: number;
  created_at: string;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function estimateReadingTime(text: string) {
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

export default function PostsManager() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState('draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('id, title, slug, status, is_featured, reading_time, views, created_at')
      .order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  useEffect(() => { fetchPosts(); }, []);

  const resetForm = () => {
    setTitle(''); setContent(''); setExcerpt(''); setStatus('draft');
    setIsFeatured(false); setSeoTitle(''); setSeoDesc(''); setEditing(null);
  };

  const handleSave = async () => {
    if (!title.trim()) { toast.error('Title is required'); return; }

    const slug = slugify(title);
    const reading_time = estimateReadingTime(content);
    const payload = {
      title, slug, content, excerpt, status, is_featured: isFeatured,
      seo_title: seoTitle || title, seo_description: seoDesc || excerpt,
      reading_time, author_id: user?.id,
      ...(status === 'published' ? { published_at: new Date().toISOString() } : {}),
    };

    if (editing) {
      const { error } = await supabase.from('posts').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Post updated');
    } else {
      const { error } = await supabase.from('posts').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Post created');
    }

    setDialogOpen(false);
    resetForm();
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Post deleted'); fetchPosts(); }
  };

  const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-display font-bold text-foreground">Posts</h1>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent"><Plus className="h-4 w-4 mr-2" />New Post</Button>
          </DialogTrigger>
          <DialogContent className="glass-strong border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editing ? 'Edit Post' : 'Create Post'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} className="bg-muted/50" /></div>
              <div><Label>Excerpt</Label><Input value={excerpt} onChange={e => setExcerpt(e.target.value)} className="bg-muted/50" /></div>
              <div><Label>Content</Label><Textarea value={content} onChange={e => setContent(e.target.value)} className="bg-muted/50 min-h-[200px]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="scheduled">Scheduled</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-6"><Switch checked={isFeatured} onCheckedChange={setIsFeatured} /><Label>Featured</Label></div>
              </div>
              <div><Label>SEO Title</Label><Input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className="bg-muted/50" maxLength={60} /></div>
              <div><Label>SEO Description</Label><Input value={seoDesc} onChange={e => setSeoDesc(e.target.value)} className="bg-muted/50" maxLength={160} /></div>
              <Button onClick={handleSave} className="w-full bg-gradient-to-r from-primary to-accent">Save Post</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-muted/50" /></div>

      <div className="space-y-2">
        {filtered.map((post, i) => (
          <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
            className="glass p-4 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-foreground truncate">{post.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="text-xs">{post.status}</Badge>
                {post.is_featured && <Badge className="bg-secondary/20 text-secondary text-xs">Featured</Badge>}
                <span className="text-xs text-muted-foreground">{post.reading_time} min read</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Eye className="h-3 w-3" />{post.views}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" onClick={() => {
                setEditing(post);
                setTitle(post.title);
                setStatus(post.status);
                setIsFeatured(post.is_featured);
                setDialogOpen(true);
              }}><Edit className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(post.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No posts yet. Create your first post!</p>}
      </div>
    </div>
  );
}
