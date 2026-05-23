import { usePublishedNews } from "@/hooks/usePublicContent";

const NewsTicker = () => {
  const { data: news = [], isLoading } = usePublishedNews(12);

  const items = isLoading
    ? ["Loading latest news..."]
    : news.length > 0
      ? news.map((item) => `${item.is_breaking ? "🔥 " : ""}${item.title}`)
      : ["Publish news in admin to populate this ticker"];

  return (
    <div className="py-4 border-y border-border bg-muted/30 overflow-hidden">
      <div className="flex animate-ticker">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex-shrink-0 px-8 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-default whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
