import type { Leader } from '@/types/content';
import type { SectionHeading as SectionHeadingType } from '@/types/content';
import SectionHeading from '@/components/SectionHeading';

type LeadershipSectionProps = {
  leaders: Leader[];
  heading: SectionHeadingType;
};

export default function LeadershipSection({ leaders, heading }: LeadershipSectionProps) {
  return (
    <section id="executives" className="section leadership-section section-dark">
      <SectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        titleHighlight={heading.title_highlight}
        intro={heading.intro}
      />

      <div className="leader-grid">
        {leaders.map((leader) => (
          <article key={`${leader.name}-${leader.position}`} className="leader-card">
            <div className="leader-photo">
              <img src={leader.image || '/images/Logo.jpg'} alt={leader.name} />
            </div>
            <div className="leader-info">
              <p className="card-eyebrow">{leader.position}</p>
              <h3>{leader.name}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
