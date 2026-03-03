import { motion } from 'framer-motion';
import { BarChart3, Eye, Users, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-foreground">Analytics</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Eye, label: 'Total Views', value: '—', color: 'bg-primary/20' },
          { icon: Users, label: 'User Growth', value: '—', color: 'bg-accent/20' },
          { icon: TrendingUp, label: 'Engagement', value: '—', color: 'bg-secondary/20' },
          { icon: BarChart3, label: 'Quiz Participation', value: '—', color: 'bg-primary/20' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-strong p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-display font-bold mt-1 text-foreground">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}><stat.icon className="h-6 w-6 text-foreground" /></div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="glass-strong p-8 rounded-xl text-center">
        <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Analytics charts will populate as content and traffic grow.</p>
      </motion.div>
    </div>
  );
}
