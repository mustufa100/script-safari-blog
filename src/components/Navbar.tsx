import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const navItems = [
  {
    label: "Articles",
    items: ["Technology", "Business", "Lifestyle", "Productivity", "AI & Future", "Startups"],
  },
  {
    label: "Quotes",
    items: ["Motivational", "Success", "Life", "Islamic", "Entrepreneur"],
  },
  {
    label: "Readers",
    items: ["Community Stories", "Featured Readers", "Testimonials", "Submit Your Story"],
  },
  {
    label: "Blog",
    items: ["Latest Posts", "Popular Posts", "Editor's Pick", "Trending"],
  },
  {
    label: "Quiz",
    items: ["Personality Quiz", "Tech Quiz", "Knowledge Quiz", "Weekly Challenge"],
  },
  {
    label: "News",
    items: ["Tech News", "Startup News", "Global News", "Crypto News"],
  },
  {
    label: "Web Stories",
    items: [],
  },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong shadow-lg shadow-background/50" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🦁</span>
            <span className="font-display text-xl font-bold gradient-text">
              Script Safari
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
                  {item.label}
                  {item.items.length > 0 && (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""}`} />
                  )}
                </button>

                <AnimatePresence>
                  {activeDropdown === item.label && item.items.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-52 glass-strong rounded-xl p-2 shadow-xl shadow-background/50"
                    >
                      {item.items.map((sub) => (
                        <a
                          key={sub}
                          href="#"
                          className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          {sub}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <motion.div className="relative hidden lg:flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary mr-2"
                    placeholder="Search..."
                    autoFocus
                  />
                )}
              </AnimatePresence>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </motion.div>

            {/* CTA */}
            <a
              href="#newsletter"
              className="hidden lg:inline-flex px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity neon-glow"
            >
              Subscribe
            </a>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-foreground"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass-strong border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <MobileNavItem key={item.label} item={item} />
              ))}
              <a
                href="#newsletter"
                className="block mt-4 px-4 py-2.5 text-sm font-semibold text-center rounded-lg bg-primary text-primary-foreground neon-glow"
              >
                Subscribe
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const MobileNavItem = ({ item }: { item: typeof navItems[0] }) => {
  const [open, setOpen] = useState(false);

  if (item.items.length === 0) {
    return (
      <a href="#" className="block px-3 py-2.5 text-sm font-medium text-foreground rounded-lg hover:bg-muted/50">
        {item.label}
      </a>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-foreground rounded-lg hover:bg-muted/50"
      >
        {item.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-4"
          >
            {item.items.map((sub) => (
              <a
                key={sub}
                href="#"
                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {sub}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
