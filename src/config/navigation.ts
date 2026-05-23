export type NavSubItem = { label: string; href: string };
export type NavItem = { label: string; href: string; items: NavSubItem[] };

export const navItems: NavItem[] = [
  {
    label: "Articles",
    href: "/articles",
    items: [
      { label: "All Articles", href: "/articles" },
      { label: "Technology", href: "/articles?category=technology" },
      { label: "Business", href: "/articles?category=business" },
      { label: "Lifestyle", href: "/articles?category=lifestyle" },
      { label: "Productivity", href: "/articles?category=productivity" },
      { label: "AI & Future", href: "/articles?category=ai-future" },
      { label: "Startups", href: "/articles?category=startups" },
    ],
  },
  {
    label: "Quotes",
    href: "/quotes",
    items: [
      { label: "All Quotes", href: "/quotes" },
      { label: "Motivational", href: "/quotes?category=motivational" },
      { label: "Success", href: "/quotes?category=success" },
      { label: "Life", href: "/quotes?category=life" },
      { label: "Islamic", href: "/quotes?category=islamic" },
      { label: "Entrepreneur", href: "/quotes?category=entrepreneur" },
    ],
  },
  {
    label: "Readers",
    href: "/readers",
    items: [
      { label: "Community Stories", href: "/readers#community" },
      { label: "Featured Readers", href: "/readers#featured" },
      { label: "Testimonials", href: "/readers#testimonials" },
      { label: "Submit Your Story", href: "/readers#submit" },
    ],
  },
  {
    label: "Blog",
    href: "/articles",
    items: [
      { label: "Latest Posts", href: "/articles" },
      { label: "Popular Posts", href: "/articles?sort=popular" },
      { label: "Editor's Pick", href: "/articles?featured=true" },
      { label: "Trending", href: "/articles?sort=popular" },
    ],
  },
  {
    label: "Quiz",
    href: "/quizzes",
    items: [
      { label: "All Quizzes", href: "/quizzes" },
      { label: "Personality Quiz", href: "/quizzes?category=personality" },
      { label: "Tech Quiz", href: "/quizzes?category=tech" },
      { label: "Knowledge Quiz", href: "/quizzes?category=knowledge" },
      { label: "Weekly Challenge", href: "/quizzes?category=challenge" },
    ],
  },
  {
    label: "News",
    href: "/news",
    items: [
      { label: "All News", href: "/news" },
      { label: "Tech News", href: "/news?category=tech" },
      { label: "Startup News", href: "/news?category=startup" },
      { label: "Global News", href: "/news?category=global" },
      { label: "Crypto News", href: "/news?category=crypto" },
    ],
  },
  {
    label: "Web Stories",
    href: "/stories",
    items: [],
  },
];
