import { motion } from "framer-motion";
import { Clock, User } from "lucide-react";

const articles = [
  {
    title: "The Future of AI: What's Coming in 2026",
    category: "AI & Future",
    readTime: "8 min",
    author: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    featured: true,
  },
  {
    title: "Building a Startup That Lasts",
    category: "Startups",
    readTime: "5 min",
    author: "James Okafor",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
    featured: false,
  },
  {
    title: "Productivity Hacks for Remote Workers",
    category: "Productivity",
    readTime: "6 min",
    author: "Mia Torres",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
    featured: false,
  },
  {
    title: "Blockchain Beyond Crypto",
    category: "Technology",
    readTime: "10 min",
    author: "Ali Raza",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80",
    featured: false,
  },
  {
    title: "Design Principles for Modern Apps",
    category: "Technology",
    readTime: "7 min",
    author: "Lena Kim",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    featured: false,
  },
  {
    title: "Mindful Living in a Digital World",
    category: "Lifestyle",
    readTime: "4 min",
    author: "Priya Sharma",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
    featured: false,
  },
];

const categoryColors: Record<string, string> = {
  "AI & Future": "bg-primary/20 text-primary",
  Startups: "bg-secondary/20 text-secondary",
  Productivity: "bg-accent/20 text-accent",
  Technology: "bg-neon-blue/20 text-neon-blue",
  Lifestyle: "bg-safari-orange/20 text-safari-orange",
};

const FeaturedArticles = () => {
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
            Handpicked stories from the brightest minds in tech, business, and beyond.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 cursor-pointer ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div className={`relative overflow-hidden ${i === 0 ? "h-72 md:h-96" : "h-48"}`}>
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${categoryColors[article.category] || "bg-muted text-muted-foreground"}`}>
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className={`font-display font-bold mb-3 group-hover:text-primary transition-colors ${i === 0 ? "text-2xl" : "text-lg"}`}>
                  {article.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {article.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {article.readTime}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
