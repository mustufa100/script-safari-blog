import { Link, useSearchParams } from "react-router-dom";
import { Zap } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import PageHeader from "@/components/PageHeader";
import { usePublishedNews } from "@/hooks/usePublicContent";

const categoryLabels: Record<string, string> = {
  tech: "Tech News",
  startup: "Startup News",
  global: "Global News",
  crypto: "Crypto News",
};

export default function NewsPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const { data: news = [], isLoading } = usePublishedNews({ limit: 50, category });

  const title = category ? categoryLabels[category] ?? category : "All News";

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="News"
        title={title}
        highlight={!category ? "News" : undefined}
        description="Latest headlines and updates."
      />

      <div className="container mx-auto px-4 max-w-3xl">
        {isLoading && (
          <p className="text-center text-muted-foreground py-12 animate-pulse">Loading news...</p>
        )}

        {!isLoading && news.length === 0 && (
          <p className="text-center text-muted-foreground py-12 glass rounded-2xl">
            No news published yet. Add stories in the admin panel.
          </p>
        )}

        <div className="space-y-4">
          {news.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.slug}`}
              className="block glass rounded-xl p-5 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start gap-3">
                {item.is_breaking && (
                  <Zap className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                )}
                <div>
                  <h2 className="font-display font-bold text-lg group-hover:text-primary transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-2 capitalize">
                    {item.category ?? "general"} · Read more →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
