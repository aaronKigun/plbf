import type { GalleryItem } from '@/types/content';
import SectionHeading from '@/components/SectionHeading';
import type { SectionHeading as SectionHeadingType } from '@/types/content';
import Reveal from '@/components/Reveal';

type GallerySectionProps = {
  items: GalleryItem[];
  heading: SectionHeadingType;
};

export default function GallerySection({ items, heading }: GallerySectionProps) {
  return (
    <section id="gallery" className="site-section">
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

        <div className="gallery-grid">
          {items.length ? (
            items.map((item) => (
              <Reveal key={`${item.title}-${item.image}`} className="gallery-item glass-card">
                <img src={item.image} alt={item.title || 'Gallery image'} loading="lazy" />
                {item.caption || item.title ? <figcaption>{item.caption || item.title}</figcaption> : null}
              </Reveal>
            ))
          ) : (
            <p className="empty-state">Gallery images will appear here once added from the admin panel.</p>
          )}
        </div>
      </div>
    </section>
  );
}
