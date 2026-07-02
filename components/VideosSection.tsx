import type { VideoItem } from '@/types/content';
import SectionHeading from '@/components/SectionHeading';
import type { SectionHeading as SectionHeadingType } from '@/types/content';

type VideosSectionProps = {
  items: VideoItem[];
  heading: SectionHeadingType;
};

function getEmbedUrl(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export default function VideosSection({ items, heading }: VideosSectionProps) {
  return (
    <section id="videos" className="section">
      <SectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        titleHighlight={heading.title_highlight}
        intro={heading.intro}
      />
      <div className="video-grid">
        {items.length ? items.map((item) => (
          <article key={`${item.title}-${item.url}`} className="video-card">
            <div className="video-frame">
              <iframe
                src={getEmbedUrl(item.url)}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="video-copy">
              <h3>{item.title}</h3>
              {item.description ? <p>{item.description}</p> : null}
            </div>
          </article>
        )) : <p className="empty-state">Videos will appear here once added from the admin panel.</p>}
      </div>
    </section>
  );
}
