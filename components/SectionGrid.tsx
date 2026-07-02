import SectionHeading from '@/components/SectionHeading';

type SectionGridProps = {
  title: string;
  items: Array<{ title: string; description: string; subtitle?: string; image?: string }>;
  alt?: boolean;
  eyebrow?: string;
  intro?: string;
  tone?: 'default' | 'white' | 'dark';
  variant?: 'default' | 'profile' | 'media';
};

export default function SectionGrid({ title, items, alt = false, eyebrow, intro, tone = 'default', variant = 'default' }: SectionGridProps) {
  const toneClass = tone === 'dark' ? ' section-dark' : tone === 'white' || alt ? ' section-alt' : '';
  const cardClass = variant === 'profile' ? ' card-profile' : variant === 'media' ? ' card-media' : '';

  return (
    <section className={`section${toneClass}`}>
      <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
      <div className="card-grid">
        {items.map((item) => (
          <article key={item.title} className={`card${cardClass}`}>
            {item.image ? (
              <div className="card-image">
                <img src={item.image} alt={item.title} />
              </div>
            ) : null}
            <div className="card-body">
              {item.subtitle ? <p className="card-eyebrow">{item.subtitle}</p> : null}
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
