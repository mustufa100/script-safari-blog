import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { useNewsBySlug } from "@/hooks/usePublicContent";

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: item, isLoading, isError } = useNewsBySlug(slug);

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to news
        </Link>

        {isLoading && (
          <p className="text-center text-muted-foreground py-24 animate-pulse">Loading...</p>
        )}

        {isError && (
          <p className="text-center text-destructive py-24">Could not load this story.</p>
        )}

        {!isLoading && !item && (
          <div className="glass-strong rounded-2xl p-12 text-center">
            <h1 className="font-display text-2xl font-bold">Story not found</h1>
          </div>
        )}

        {item && (
          <article>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary capitalize">
              {item.category ?? "news"}
            </span>
            <h1 className="font-display text-4xl font-bold mt-4 mb-6">{item.title}</h1>
            <div className="prose prose-invert max-w-none">
              {(item.content || "")
                .split("\n")
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i} className="text-foreground/90 leading-relaxed mb-4">
                    {p}
                  </p>
                ))}
            </div>
          </article>
        )}
      </div>
    </PublicLayout>
  );
}
