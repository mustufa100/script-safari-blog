import { motion } from "framer-motion";
import { Sparkles, Brain, Zap } from "lucide-react";
import { useActiveQuizzes } from "@/hooks/usePublicContent";

const iconByCategory: Record<string, typeof Brain> = {
  personality: Brain,
  knowledge: Sparkles,
  challenge: Zap,
};

const colorByIndex = ["primary", "accent", "secondary"] as const;

const QuizPreview = () => {
  const { data: quizzes = [], isLoading } = useActiveQuizzes({ limit: 3 });

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">
            Interactive
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Take a <span className="gradient-text">Quiz</span>
          </h2>
        </motion.div>

        {isLoading && (
          <p className="text-center text-muted-foreground animate-pulse">Loading quizzes...</p>
        )}

        {!isLoading && quizzes.length === 0 && (
          <p className="text-center text-muted-foreground">Create active quizzes in admin to list them here.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {quizzes.map((quiz, i) => {
            const Icon = iconByCategory[quiz.category ?? ""] ?? Brain;
            const color = colorByIndex[i % colorByIndex.length];

            return (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-6 text-center cursor-pointer group hover:border-primary/30 transition-all"
              >
                <div
                  className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                    color === "primary" ? "bg-primary/20" : color === "accent" ? "bg-accent/20" : "bg-secondary/20"
                  }`}
                >
                  <Icon
                    className={`w-7 h-7 ${
                      color === "primary" ? "text-primary" : color === "accent" ? "text-accent" : "text-secondary"
                    }`}
                  />
                </div>
                <span className="text-xs text-muted-foreground mb-2 block capitalize">{quiz.category}</span>
                <h3 className="font-display font-bold text-lg mb-2">{quiz.title}</h3>
                {quiz.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{quiz.description}</p>
                )}
                <span className="inline-block px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground animate-pulse_glow cursor-pointer">
                  Start Quiz
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuizPreview;
