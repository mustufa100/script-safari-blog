import { Github, Twitter, Instagram, Linkedin, Heart } from "lucide-react";

const links = {
  Product: ["Articles", "Quotes", "Web Stories", "Quiz", "News"],
  Company: ["About Us", "Careers", "Press", "Contact"],
  Resources: ["Blog", "Community", "Support", "FAQ"],
  Legal: ["Privacy", "Terms", "Cookies"],
};

const socials = [
  { icon: Twitter, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Github, href: "#" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🦁</span>
              <span className="font-display text-lg font-bold gradient-text">Script Safari</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Bold ideas, curated stories, and a community that thinks different.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href }) => (
                <a
                  key={href + Icon.displayName}
                  href={href}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Script Safari. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-destructive" /> for curious minds
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
