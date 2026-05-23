import { useSearchParams } from "react-router-dom";
import PublicLayout from "@/components/PublicLayout";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { usePublishedPosts } from "@/hooks/usePublicContent";

const categoryLabels: Record<string, string> = {
  technology: "Technology",
  business: "Business",
  lifestyle: "Lifestyle",
  productivity: "Productivity",
  "ai-future": "AI & Future",
  startups: "Startups",
};

export default function ArticlesPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const featured = searchParams.get("featured") === "true";
  const sort = searchParams.get("sort") === "popular" ? "popular" : "latest";

  const { data: posts = [], isLoading } = usePublishedPosts({
    limit: 50,
    categorySlug: category,
    featuredOnly: featured,
    sort,
  });

  const title = featured
    ? "Editor's Pick"
    : sort === "popular"
      ? "Popular Posts"
      : category
        ? categoryLabels[category] ?? category
        : "All Articles";

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Blog"
        title={title}
        highlight={!category && !featured && sort !== "popular" ? "Articles" : undefined}
        description="Published stories from Script Safari."
      />

      <div className="container mx-auto px-4">
        {isLoading && (
          <p className="text-center text-muted-foreground py-12 animate-pulse">Loading articles...</p>
        )}

        {!isLoading && posts.length === 0 && (
          <p className="text-center text-muted-foreground py-12 glass rounded-2xl">
            No articles found in this category yet.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ArticleCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              featuredImage={post.featured_image}
              categoryName={post.categories?.name}
              categoryColor={post.categories?.color ?? undefined}
              authorName={post.authorName}
              readingTime={post.reading_time}
            />
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
