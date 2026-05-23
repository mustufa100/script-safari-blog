import { motion } from "framer-motion";
import { Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { usePublishedPosts } from "@/hooks/usePublicContent";
import { DEFAULT_POST_IMAGE } from "@/lib/placeholders";

const FeaturedArticles = () => {
  const { data: posts = [], isLoading } = usePublishedPosts({ limit: 6 });

  return (
    <section id="articles" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">
            Featured Content
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Latest <span className="gradient-text">Articles</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Stories published from the admin panel appear here automatically.
          </p>
        </motion.div>

        {isLoading && (
          <p className="text-center text-muted-foreground py-12 animate-pulse">Loading articles...</p>
        )}

        {!isLoading && posts.length === 0 && (
          <p className="text-center text-muted-foreground py-12 glass rounded-2xl">
            No published posts yet. Create a post in admin and set status to <strong>Published</strong>.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((article, i) => {
            const categoryName = article.categories?.name ?? "General";
            const categoryColor = article.categories?.color ?? "#8B5CF6";

            return (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 ${
                  i === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <Link to={`/post/${article.slug}`} className="block">
                  <div className={`relative overflow-hidden ${i === 0 ? "h-72 md:h-96" : "h-48"}`}>
                    <img
                      src={article.featured_image || DEFAULT_POST_IMAGE}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span
                        className="px-3 py-1 text-xs font-semibold rounded-full"
                        style={{
                          backgroundColor: `${categoryColor}33`,
                          color: categoryColor,
                        }}
                      >
                        {categoryName}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3
                      className={`font-display font-bold mb-3 group-hover:text-primary transition-colors ${
                        i === 0 ? "text-2xl" : "text-lg"
                      }`}
                    >
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {article.authorName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {article.reading_time ?? 1} min
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
