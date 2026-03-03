import { motion } from "framer-motion";
import { Send } from "lucide-react";

const Newsletter = () => {
  return (
    <section id="newsletter" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">
            Stay Updated
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Join the <span className="gradient-text">Safari</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Get weekly curated content, exclusive stories, and early access to new features.
          </p>

          <div className="glass rounded-2xl p-2 flex gap-2 neon-glow max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              Subscribe <Send className="w-4 h-4" />
            </motion.button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            No spam. Unsubscribe anytime. 10K+ subscribers.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
