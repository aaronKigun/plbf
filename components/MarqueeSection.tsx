const items = ['Justice', 'Integrity', 'Collegiality', 'Veritas', 'Rule of Law', 'Advocacy', 'Solidarity', 'Excellence'];

export default function MarqueeSection() {
  const track = (
    <span className="marquee-group">
      {items.map((item) => (
        <span key={item} className="marquee-item">
          {item}
          <span className="marquee-diamond" aria-hidden="true">&#9670;</span>
        </span>
      ))}
    </span>
  );

  return (
    <div className="marquee-bar" aria-hidden="true">
      <div className="marquee-track">
        {track}
        {track}
      </div>
    </div>
  );
}
