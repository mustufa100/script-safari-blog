import PublicLayout from "@/components/PublicLayout";
import PageHeader from "@/components/PageHeader";
import { useActiveStories } from "@/hooks/usePublicContent";
import { DEFAULT_STORY_IMAGE } from "@/lib/placeholders";

const gradients = [
  "from-primary to-accent",
  "from-secondary to-primary",
  "from-accent to-secondary",
];

export default function StoriesPage() {
  const { data: stories = [], isLoading } = useActiveStories(50);

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Immersive"
        title="Web"
        highlight="Stories"
        description="Tap through visual stories from Script Safari."
      />

      <div className="container mx-auto px-4">
        {isLoading && (
          <p className="text-center text-muted-foreground py-12 animate-pulse">Loading stories...</p>
        )}

        {!isLoading && stories.length === 0 && (
          <p className="text-center text-muted-foreground py-12 glass rounded-2xl">
            No active web stories yet. Add them in the admin panel.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 justify-items-center">
          {stories.map((story, i) => (
            <div key={story.id} className="flex flex-col items-center gap-3 text-center">
              <div
                className={`w-24 h-24 md:w-28 md:h-28 rounded-full p-[3px] bg-gradient-to-br ${
                  gradients[i % gradients.length]
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-background">
                  <img
                    src={story.thumbnail || DEFAULT_STORY_IMAGE}
                    alt={story.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <span className="text-sm font-medium max-w-[120px]">{story.title}</span>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
