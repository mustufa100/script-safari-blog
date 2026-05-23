import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PublicLayout from "@/components/PublicLayout";
import PageHeader from "@/components/PageHeader";

const sections = [
  {
    id: "community",
    title: "Community Stories",
    text: "Real journeys from readers who explore ideas with Script Safari. Share yours and inspire others.",
  },
  {
    id: "featured",
    title: "Featured Readers",
    text: "Spotlight members of our community — thinkers, builders, and storytellers making an impact.",
  },
  {
    id: "testimonials",
    title: "Testimonials",
    text: "What our readers say about discovering bold ideas and curated stories on Script Safari.",
  },
  {
    id: "submit",
    title: "Submit Your Story",
    text: "Have a story to tell? Reach out at hello@scriptsafari.com — we'd love to feature your voice.",
  },
];

export default function ReadersPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Community"
        title="Our"
        highlight="Readers"
        description="The people who make Script Safari a place for curious minds."
      />

      <div className="container mx-auto px-4 max-w-3xl space-y-12">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="glass rounded-2xl p-8 scroll-mt-28"
          >
            <h2 className="font-display text-2xl font-bold mb-3">{section.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{section.text}</p>
          </section>
        ))}
      </div>
    </PublicLayout>
  );
}
