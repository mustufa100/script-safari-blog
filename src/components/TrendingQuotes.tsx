import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useQuotes } from "@/hooks/usePublicContent";

const TrendingQuotes = () => {
  const { data: quotes = [], isLoading } = useQuotes(10);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (quotes.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  useEffect(() => {
    setCurrent(0);
  }, [quotes.length]);

  const prev = () => setCurrent((c) => (c - 1 + quotes.length) % quotes.length);
  const next = () => setCurrent((c) => (c + 1) % quotes.length);

  const active = quotes[current];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3 block">
            Daily Inspiration
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Trending <span className="gradient-text">Quotes</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="glass rounded-2xl p-8 md:p-12 text-center relative neon-glow min-h-[220px] flex flex-col justify-center">
            {isLoading && (
              <p className="text-muted-foreground animate-pulse">Loading quotes...</p>
            )}

            {!isLoading && quotes.length === 0 && (
              <p className="text-muted-foreground">Add quotes in the admin panel to show them here.</p>
            )}

            {!isLoading && active && (
              <>
                <Quote className="w-10 h-10 text-primary/30 mx-auto mb-6" />
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="font-display text-2xl md:text-3xl font-bold mb-6 leading-relaxed">
                    &ldquo;{active.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-foreground font-semibold">{active.author}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary capitalize">
                      {active.category}
                    </span>
                  </div>
                </motion.div>

                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={prev}
                    className="p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-1.5">
                    {quotes.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === current ? "bg-primary w-6" : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={next}
                    className="p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingQuotes;
