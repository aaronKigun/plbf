import type { VideoItem } from '@/types/content';
import SectionHeading from '@/components/SectionHeading';
import type { SectionHeading as SectionHeadingType } from '@/types/content';
import Reveal from '@/components/Reveal';

type VideosSectionProps = {
  items: VideoItem[];
  heading: SectionHeadingType;
};

function isYouTubeUrl(url: string) {
  return /(?:youtube\.com|youtu\.be)/.test(url);
}

function getEmbedUrl(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export default function VideosSection({ items, heading }: VideosSectionProps) {
  return (
    <section id="videos" className="site-section">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            eyebrow={heading.eyebrow}
            title={heading.title}
            titleHighlight={heading.title_highlight}
            intro={heading.intro}
            centered={false}
            sectionNum="08"
          />
        </Reveal>

        <div className="video-grid">
          {items.length ? (
            items.map((item) => (
              <Reveal key={`${item.title}-${item.url}`} as="article" className="glass-card video-card">
                <div className="video-frame">
                  {isYouTubeUrl(item.url) ? (
                    <iframe
                      src={getEmbedUrl(item.url)}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={item.url} controls playsInline preload="metadata" />
                  )}
                </div>
                <div className="video-copy">
                  <h3>{item.title}</h3>
                  {item.description ? <p>{item.description}</p> : null}
                </div>
              </Reveal>
            ))
          ) : (
            <p className="empty-state">Videos will appear here once added from the admin panel.</p>
          )}
        </div>
      </div>
    </section>
  );
}
