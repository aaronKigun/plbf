import type { GalleryItem } from '@/types/content';
import SectionHeading from '@/components/SectionHeading';
import type { SectionHeading as SectionHeadingType } from '@/types/content';

type GallerySectionProps = {
  items: GalleryItem[];
  heading: SectionHeadingType;
};

export default function GallerySection({ items, heading }: GallerySectionProps) {
  return (
    <section id="gallery" className="section section-alt">
      <SectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        titleHighlight={heading.title_highlight}
        intro={heading.intro}
      />
      <div className="gallery-grid">
        {items.length ? items.map((item) => (
          <figure key={`${item.title}-${item.image}`} className="gallery-item">
            <img src={item.image} alt={item.title || 'Gallery image'} />
            {item.caption || item.title ? (
              <figcaption>{item.caption || item.title}</figcaption>
            ) : null}
          </figure>
        )) : <p className="empty-state">Gallery images will appear here once added from the admin panel.</p>}
      </div>
    </section>
  );
}
