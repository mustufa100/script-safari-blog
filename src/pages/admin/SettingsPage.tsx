import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="glass-strong p-8 rounded-xl text-center">
        <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Site settings and configuration options coming soon.</p>
      </motion.div>
    </div>
  );
}
