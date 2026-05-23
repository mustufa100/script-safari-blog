import { useSearchParams } from "react-router-dom";
import { Brain, Sparkles, Zap } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import PageHeader from "@/components/PageHeader";
import { useActiveQuizzes } from "@/hooks/usePublicContent";

const iconByCategory: Record<string, typeof Brain> = {
  personality: Brain,
  knowledge: Sparkles,
  challenge: Zap,
  tech: Sparkles,
};

export default function QuizzesPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const { data: quizzes = [], isLoading } = useActiveQuizzes({ limit: 50, category });

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Interactive"
        title={category ? `${category} ` : "All "}
        highlight="Quizzes"
        description="Test your knowledge and have fun."
      />

      <div className="container mx-auto px-4">
        {isLoading && (
          <p className="text-center text-muted-foreground py-12 animate-pulse">Loading quizzes...</p>
        )}

        {!isLoading && quizzes.length === 0 && (
          <p className="text-center text-muted-foreground py-12 glass rounded-2xl">
            No quizzes available in this category yet.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {quizzes.map((quiz) => {
            const Icon = iconByCategory[quiz.category ?? ""] ?? Brain;
            return (
              <div
                key={quiz.id}
                className="glass rounded-2xl p-6 text-center hover:border-primary/30 transition-all"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground capitalize block mb-2">
                  {quiz.category}
                </span>
                <h2 className="font-display font-bold text-lg mb-2">{quiz.title}</h2>
                {quiz.description && (
                  <p className="text-sm text-muted-foreground mb-4">{quiz.description}</p>
                )}
                <span className="inline-block px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground">
                  Coming soon
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </PublicLayout>
  );
}
