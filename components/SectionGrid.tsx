import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

type SectionGridProps = {
  id?: string;
  title: string;
  titleHighlight?: string;
  items: Array<{ title: string; description: string; subtitle?: string; image?: string }>;
  eyebrow?: string;
  intro?: string;
  variant?: 'default' | 'profile' | 'media' | 'governance';
  sectionNum?: string;
};

const governanceIcons: Record<string, string> = {
  Constitution: '§',
  'Code of Conduct': '✓',
  'Membership Criteria': '◎',
  'Continuing Legal Education': '◆',
  'Committees & Working Groups': '▦',
  'Annual Report': '▤'
};

export default function SectionGrid({
  id,
  title,
  titleHighlight,
  items,
  eyebrow,
  intro,
  variant = 'default',
  sectionNum
}: SectionGridProps) {
  const gridClass =
    variant === 'profile'
      ? 'card-grid profile-grid'
      : variant === 'media'
        ? 'card-grid media-grid'
        : variant === 'governance'
          ? 'card-grid governance-grid'
          : 'card-grid';

  return (
    <section id={id} className="site-section">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            titleHighlight={titleHighlight}
            intro={intro}
            sectionNum={sectionNum}
          />
        </Reveal>

        <div className={gridClass}>
          {items.map((item) => (
            <Reveal key={item.title} as="article" className={`glass-card card-${variant}`}>
              {variant === 'governance' ? (
                <>
                  <div className="gov-icon-area" aria-hidden="true">
                    {governanceIcons[item.title] || '•'}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </>
              ) : variant === 'profile' ? (
                <>
                  {item.image ? (
                    <div className="profile-avatar">
                      <img src={item.image} alt={item.title} />
                    </div>
                  ) : (
                    <div className="profile-avatar initials-avatar">
                      <span>{getInitials(item.title)}</span>
                    </div>
                  )}
                  {item.subtitle ? <span className="pill pill-sm">{item.subtitle}</span> : null}
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </>
              ) : variant === 'media' ? (
                <>
                  {item.image ? (
                    <div className="media-image">
                      <img src={item.image} alt={item.title} loading="lazy" />
                      {item.subtitle ? <span className="media-badge">{item.subtitle}</span> : null}
                    </div>
                  ) : null}
                  <div className="media-body">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </>
              ) : (
                <>
                  {item.image ? (
                    <div className="media-image">
                      <img src={item.image} alt={item.title} loading="lazy" />
                    </div>
                  ) : null}
                  <div className="media-body">
                    {item.subtitle ? <p className="card-eyebrow">{item.subtitle}</p> : null}
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function getInitials(name: string) {
  if (!name) return 'PL';
  const cleanName = name.replace(/(Barr\.|Chief|Esq\.|Mrs\.|Mr\.|Dr\.)/gi, '').trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return name.slice(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
