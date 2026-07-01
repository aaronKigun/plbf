type SectionGridProps = {
  title: string;
  items: Array<{ title: string; description: string; subtitle?: string }>;
  alt?: boolean;
  eyebrow?: string;
  intro?: string;
  tone?: 'default' | 'white' | 'dark';
};

export default function SectionGrid({ title, items, alt = false, eyebrow, intro, tone = 'default' }: SectionGridProps) {
  const toneClass = tone === 'dark' ? ' section-dark' : tone === 'white' || alt ? ' section-alt' : '';

  return (
    <section className={`section${toneClass}`}>
      <div className="section-heading centered">
        {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
        {intro ? <p>{intro}</p> : null}
      </div>
      <div className="card-grid">
        {items.map((item) => (
          <article key={item.title} className="card">
            <h3>{item.title}</h3>
            {item.subtitle ? <p className="muted">{item.subtitle}</p> : null}
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
