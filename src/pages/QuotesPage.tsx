import { useSearchParams } from "react-router-dom";
import { Quote } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import PageHeader from "@/components/PageHeader";
import { useQuotes } from "@/hooks/usePublicContent";

export default function QuotesPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const { data: quotes = [], isLoading } = useQuotes({ limit: 50, category });

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Inspiration"
        title={category ? category : "All"}
        highlight="Quotes"
        description="Wisdom and motivation from Script Safari."
      />

      <div className="container mx-auto px-4 max-w-3xl">
        {isLoading && (
          <p className="text-center text-muted-foreground py-12 animate-pulse">Loading quotes...</p>
        )}

        {!isLoading && quotes.length === 0 && (
          <p className="text-center text-muted-foreground py-12 glass rounded-2xl">
            No quotes in this category yet.
          </p>
        )}

        <div className="space-y-6">
          {quotes.map((q) => (
            <div key={q.id} className="glass rounded-2xl p-8 text-center">
              <Quote className="w-8 h-8 text-primary/30 mx-auto mb-4" />
              <p className="font-display text-xl md:text-2xl font-bold mb-4">
                &ldquo;{q.text}&rdquo;
              </p>
              <p className="font-semibold">{q.author}</p>
              <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary capitalize">
                {q.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
