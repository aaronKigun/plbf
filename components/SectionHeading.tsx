type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  intro?: string;
  centered?: boolean;
  sectionNum?: string;
};

export default function SectionHeading({ eyebrow, title, titleHighlight, intro, centered = true, sectionNum }: SectionHeadingProps) {
  return (
    <div className={`section-heading${centered ? ' centered' : ''}`}>
      {sectionNum ? <span className="section-num" aria-hidden="true">{sectionNum}</span> : null}
      {eyebrow ? <span className="pill">{eyebrow}</span> : null}
      <h2>
        {title}
        {titleHighlight ? <><br /><span className="heading-accent">{titleHighlight}</span></> : null}
      </h2>
      {intro ? <p className="section-intro">{intro}</p> : null}
    </div>
  );
}
