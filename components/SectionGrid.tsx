type SectionGridProps = {
  title: string;
  items: Array<{ title: string; description: string; subtitle?: string }>;
  alt?: boolean;
};

export default function SectionGrid({ title, items, alt = false }: SectionGridProps) {
  return (
    <section className={`section${alt ? ' section-alt' : ''}`}>
      <h2>{title}</h2>
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
