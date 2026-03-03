import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, MessageSquare, FolderOpen, TrendingUp, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  posts: number;
  users: number;
  comments: number;
  categories: number;
}

const StatCard = ({ icon: Icon, label, value, color, delay }: {
  icon: any; label: string; value: number; color: string; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-strong p-6 rounded-xl"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-display font-bold mt-1 text-foreground">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-foreground" />
      </div>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ posts: 0, users: 0, comments: 0, categories: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [posts, comments, categories, users] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('comments').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        posts: posts.count ?? 0,
        users: users.count ?? 0,
        comments: comments.count ?? 0,
        categories: categories.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to Script Safari CMS</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total Posts" value={stats.posts} color="bg-primary/20" delay={0} />
        <StatCard icon={Users} label="Total Users" value={stats.users} color="bg-accent/20" delay={0.1} />
        <StatCard icon={MessageSquare} label="Comments" value={stats.comments} color="bg-secondary/20" delay={0.2} />
        <StatCard icon={FolderOpen} label="Categories" value={stats.categories} color="bg-primary/20" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-strong p-6 rounded-xl">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Recent Activity
          </h3>
          <div className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">No recent activity yet. Start creating content!</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-strong p-6 rounded-xl">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Eye className="h-5 w-5 text-accent" /> Quick Stats
          </h3>
          <div className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">Analytics data will appear here as content grows.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
