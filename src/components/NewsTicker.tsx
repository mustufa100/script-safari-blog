const newsItems = [
  "🔥 OpenAI launches GPT-6 with multimodal reasoning",
  "📈 Bitcoin surges past $150K amid institutional buying",
  "🚀 SpaceX completes first Mars cargo mission",
  "💡 Apple unveils Vision Pro 3 with neural interface",
  "🌍 EU passes landmark AI regulation framework",
  "⚡ Tesla's new battery lasts 1M miles",
  "🎮 Meta launches full-body VR haptic suit",
  "📱 Google announces Android 18 with AI-first design",
];

const NewsTicker = () => {
  return (
    <div className="py-4 border-y border-border bg-muted/30 overflow-hidden">
      <div className="flex animate-ticker">
        {[...newsItems, ...newsItems].map((item, i) => (
          <span
            key={i}
            className="flex-shrink-0 px-8 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
