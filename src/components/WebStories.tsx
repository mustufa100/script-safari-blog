import { motion } from "framer-motion";

const stories = [
  { title: "AI Revolution", color: "from-primary to-accent", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&q=80" },
  { title: "Startup Life", color: "from-secondary to-primary", image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&q=80" },
  { title: "Design Trends", color: "from-accent to-secondary", image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&q=80" },
  { title: "Tech News", color: "from-primary to-secondary", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80" },
  { title: "Crypto World", color: "from-accent to-primary", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&q=80" },
  { title: "Lifestyle", color: "from-secondary to-accent", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&q=80" },
  { title: "Productivity", color: "from-primary to-accent", image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300&q=80" },
];

const WebStories = () => {
  return (
    <section id="stories" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-3 block">
            Immersive Content
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Web <span className="gradient-text">Stories</span>
          </h2>
        </motion.div>

        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide justify-start lg:justify-center">
          {stories.map((story, i) => (
            <motion.button
              key={story.title}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.08 }}
              className="flex flex-col items-center gap-3 flex-shrink-0 group"
            >
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] bg-gradient-to-br ${story.color}`}>
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-background">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {story.title}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WebStories;
