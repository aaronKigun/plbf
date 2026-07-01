type HeroSectionProps = {
  title: string;
  subtitle: string;
  description: string;
};

export default function HeroSection({ title, subtitle, description }: HeroSectionProps) {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="eyebrow">Advancing Justice on the Plateau</p>
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
        <p>{description}</p>
        <div className="hero-actions">
          <a href="#about" className="btn btn-dark">Learn More</a>
          <a href="/admin" className="btn btn-gold">Admin</a>
        </div>
      </div>
    </section>
  );
}
