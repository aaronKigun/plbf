import type { Leader } from '@/types/content';

type LeadershipSectionProps = {
  leaders: Leader[];
};

export default function LeadershipSection({ leaders }: LeadershipSectionProps) {
  return (
    <section id="executives" className="section leadership-section">
      <div className="section-heading centered">
        <span className="section-eyebrow">Leadership</span>
        <h2>
          Executive <span>Committee</span>
        </h2>
      </div>

      <div className="leader-grid">
        {leaders.map((leader) => (
          <article key={`${leader.name}-${leader.position}`} className="leader-card">
            <div className="leader-photo">
              <img src={leader.image || '/images/Logo.jpg'} alt={leader.name} />
            </div>
            <div className="leader-info">
              <h3>{leader.name}</h3>
              <p>{leader.position}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
