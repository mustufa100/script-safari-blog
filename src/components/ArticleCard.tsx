import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";
import { DEFAULT_POST_IMAGE } from "@/lib/placeholders";

type ArticleCardProps = {
  slug: string;
  title: string;
  featuredImage?: string | null;
  categoryName?: string;
  categoryColor?: string;
  authorName?: string;
  readingTime?: number | null;
  large?: boolean;
};

export default function ArticleCard({
  slug,
  title,
  featuredImage,
  categoryName = "General",
  categoryColor = "#8B5CF6",
  authorName = "Script Safari",
  readingTime = 1,
  large = false,
}: ArticleCardProps) {
  return (
    <Link
      to={`/post/${slug}`}
      className="group glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 block"
    >
      <div className={`relative overflow-hidden ${large ? "h-72" : "h-48"}`}>
        <img
          src={featuredImage || DEFAULT_POST_IMAGE}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <span
            className="px-3 py-1 text-xs font-semibold rounded-full"
            style={{ backgroundColor: `${categoryColor}33`, color: categoryColor }}
          >
            {categoryName}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3
          className={`font-display font-bold mb-3 group-hover:text-primary transition-colors ${
            large ? "text-2xl" : "text-lg"
          }`}
        >
          {title}
        </h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" /> {authorName}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {readingTime ?? 1} min
          </span>
        </div>
      </div>
    </Link>
  );
}
