type SectionCardProps = {
  title: string;
  description: string;
  subtitle?: string;
};

export default function SectionCard({ title, description, subtitle }: SectionCardProps) {
  return (
    <article className="card">
      <h3>{title}</h3>
      {subtitle ? <p className="muted">{subtitle}</p> : null}
      <p>{description}</p>
    </article>
  );
}
