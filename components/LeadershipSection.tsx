import type { Leader } from '@/types/content';
import type { SectionHeading as SectionHeadingType } from '@/types/content';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

type LeadershipSectionProps = {
  leaders: Leader[];
  heading: SectionHeadingType;
};

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
            sectionNum="04"
          />
        </Reveal>

        <div className="leader-grid">
          {leaders.map((leader) => (
            <Reveal key={`${leader.name}-${leader.position}`} as="article" className="glass-card leader-card">
              <div className="team-img-wrap">
                <img src={leader.image || '/images/Logo.jpg'} alt={leader.name} loading="lazy" />
                <span className="pill pill-sm team-role">{leader.position}</span>
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
