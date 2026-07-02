type HeroSectionProps = {
  title: string;
  subtitle: string;
  description: string;
};

export default function HeroSection({ title, subtitle, description }: HeroSectionProps) {
  return (
    <section className="hero" id="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-copy">
          <p className="eyebrow">Advancing Justice on the Plateau</p>
          <h1>{title}</h1>
          <p className="subtitle">{subtitle}</p>
          <p>{description}</p>
          <div className="hero-actions">
            <a href="#about" className="btn btn-dark">Learn More</a>
            <a href="#membership" className="btn btn-gold">Become a Member</a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-card hero-card-main" />
          <div className="hero-card hero-card-secondary" />
        </div> 
      </div>
    </section>
  );
}
