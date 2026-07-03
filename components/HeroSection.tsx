type HeroSectionProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  description: string;
};

function splitHeroTitle(title: string) {
  const marker = 'Bar Forum';
  const idx = title.lastIndexOf(marker);
  if (idx > 0) {
    return { main: title.slice(0, idx).trim(), accent: marker };
  }
  const parts = title.split(' ');
  if (parts.length < 2) return { main: title, accent: '' };
  return { main: parts.slice(0, -1).join(' '), accent: parts[parts.length - 1] };
}

export default function HeroSection({ eyebrow = 'Advancing Justice on the Plateau', title, subtitle, description }: HeroSectionProps) {
  const { main, accent } = splitHeroTitle(title);

  return (
    <section className="hero-section" id="hero">
      <div className="orb orb-gold hero-orb-top" aria-hidden="true" />
      <div className="orb orb-navy hero-orb-bottom" aria-hidden="true" />
      <div className="hero-grid-lines" aria-hidden="true" />

      <div className="hero-inner site-container">
        <div className="hero-logo-wrap">
          <img src="/images/Logo.jpg" alt="PLBF emblem" className="hero-logo" />
        </div>

        <span className="pill">{eyebrow}</span>

        <h1 className="hero-title">
          <span className="hero-title-main">{main}</span>
          {accent ? <span className="hero-title-accent">{accent}</span> : null}
        </h1>

        <p className="hero-subtitle">{subtitle}</p>
        <p className="hero-description">{description}</p>

        <div className="hero-actions">
          <a href="#about" className="mag-btn">
            <span>Learn More</span>
          </a>
          <a href="#membership" className="mag-btn mag-btn-muted">
            <span>Become a Member</span>
          </a>
        </div>
      </div>

      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-indicator-line" />
      </div>
    </section>
  );
}
