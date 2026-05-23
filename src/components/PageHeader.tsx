type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
};

export default function PageHeader({ eyebrow, title, highlight, description }: PageHeaderProps) {
  return (
    <div className="container mx-auto px-4 mb-12 text-center">
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">
          {eyebrow}
        </span>
      )}
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
        {title}
        {highlight && <> <span className="gradient-text">{highlight}</span></>}
      </h1>
      {description && (
        <p className="text-muted-foreground max-w-lg mx-auto">{description}</p>
      )}
    </div>
  );
}
