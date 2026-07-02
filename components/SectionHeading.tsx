type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  intro?: string;
};

export default function SectionHeading({ eyebrow, title, titleHighlight, intro }: SectionHeadingProps) {
  return (
    <div className="section-heading centered">
      {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
      <h2>
        {title}
        {titleHighlight ? <> <span>{titleHighlight}</span></> : null}
      </h2>
      {intro ? <p>{intro}</p> : null}
    </div>
  );
}
