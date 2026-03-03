import { motion } from "framer-motion";
import { Sparkles, Brain, Zap } from "lucide-react";

const quizzes = [
  { title: "What Type of Tech Leader Are You?", icon: Brain, category: "Personality", color: "primary" },
  { title: "Test Your AI Knowledge", icon: Sparkles, category: "Tech Quiz", color: "accent" },
  { title: "Weekly Challenge: Startup IQ", icon: Zap, category: "Challenge", color: "secondary" },
];

const QuizPreview = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {quizzes.map((quiz, i) => (
            <motion.div
              key={quiz.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 text-center cursor-pointer group hover:border-primary/30 transition-all"
            >
              <div className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                quiz.color === "primary" ? "bg-primary/20" : quiz.color === "accent" ? "bg-accent/20" : "bg-secondary/20"
              }`}>
                <quiz.icon className={`w-7 h-7 ${
                  quiz.color === "primary" ? "text-primary" : quiz.color === "accent" ? "text-accent" : "text-secondary"
                }`} />
              </div>
              <span className="text-xs text-muted-foreground mb-2 block">{quiz.category}</span>
              <h3 className="font-display font-bold text-lg mb-4">{quiz.title}</h3>
              <span className="inline-block px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground animate-pulse_glow cursor-pointer">
                Start Quiz
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuizPreview;
