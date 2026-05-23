import { motion } from "framer-motion";
import { useActiveStories } from "@/hooks/usePublicContent";
import { DEFAULT_STORY_IMAGE } from "@/lib/placeholders";

const gradients = [
  "from-primary to-accent",
  "from-secondary to-primary",
  "from-accent to-secondary",
  "from-primary to-secondary",
  "from-accent to-primary",
  "from-secondary to-accent",
];

const WebStories = () => {
  const { data: stories = [], isLoading } = useActiveStories(12);

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

        {isLoading && (
          <p className="text-center text-muted-foreground animate-pulse">Loading stories...</p>
        )}

        {!isLoading && stories.length === 0 && (
          <p className="text-center text-muted-foreground">Add active web stories in admin to display them here.</p>
        )}

        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide justify-start lg:justify-center">
          {stories.map((story, i) => (
            <motion.button
              key={story.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.08 }}
              className="flex flex-col items-center gap-3 flex-shrink-0 group"
              type="button"
            >
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] bg-gradient-to-br ${gradients[i % gradients.length]}`}>
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-background">
                  <img
                    src={story.thumbnail || DEFAULT_STORY_IMAGE}
                    alt={story.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors max-w-[96px] truncate">
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
