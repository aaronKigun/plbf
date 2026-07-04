import type { Leader } from '@/types/content';
import type { SectionHeading as SectionHeadingType } from '@/types/content';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

type LeadershipSectionProps = {
  leaders: Leader[];
  heading: SectionHeadingType;
};

function getInitials(name: string): string {
  if (!name) return 'PL';
  const cleanName = name.replace(
    /(Barr\.|Chief|Esq\.|Mrs\.|Mr\.|Dr\.)/gi,
    ''
  ).trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return name.slice(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function LeadershipSection({ leaders, heading }: LeadershipSectionProps) {
  return (
    <section id="executives" className="site-section section-leadership">
      <div className="orb orb-gold leadership-orb" aria-hidden="true" />
      <div className="site-container">
        <Reveal>
          <SectionHeading
            eyebrow={heading.eyebrow}
            title={heading.title}
            titleHighlight={heading.title_highlight}
            intro={heading.intro}
            centered={false}
            sectionNum="03"
          />
        </Reveal>

        <div className="leader-grid">
          {leaders.map((leader) => (
            <Reveal
              key={`${leader.name}-${leader.position}`}
              as="article"
              className="glass-card leader-card"
            >
              <div className="team-img-wrap">
                {leader.image ? (
                  <img
                    src={leader.image}
                    alt={leader.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="team-img-wrap-initials">
                    <span>{getInitials(leader.name)}</span>
                  </div>
                )}
                <span className="team-role">{leader.position}</span>
              </div>
              <div className="leader-info">
                <h3>{leader.name}</h3>
                <p>{leader.position}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}