import { useMemo, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Info, HelpCircle, Video, Image, LayoutGrid } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { Banner, Lang, TranslationStrings } from '../types';
import type { GallerySection } from './CreativesGallery';
import BannerCard from './BannerCard';
import FormatShowcase from './FormatShowcase';
import InstagramPost from './InstagramPost';
import MediaCard from './MediaCard';
import { STATIC_MEDIA, VIDEO_MEDIA } from '../data/media';

// Static images + videos, flagged, for the Gallery "everything" grid.
const GALLERY_MEDIA = [
  ...STATIC_MEDIA.map((item) => ({ item, isVideo: false })),
  ...VIDEO_MEDIA.map((item) => ({ item, isVideo: true })),
];

// Reveals its children with a subtle fade-up the first time they scroll into view.
function RevealCard({ delay, children }: { delay: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`card-reveal${visible ? ' is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

type GalleryGridProps = {
  banners: Banner[];
  section: GallerySection;
  favorites: string[];
  lang: Lang;
  t: TranslationStrings;
  onOpenSandbox: (banner: Banner) => void;
  onToggleFavorite: (id: string, e: MouseEvent) => void;
  onClearFilters: () => void;
  selectedFormat: string;
  showGalleryMedia: boolean; // append static+video media to the gallery grid (no filters active)
};

export default function GalleryGrid({ banners, section, favorites, lang, t, onOpenSandbox, onToggleFavorite, onClearFilters, selectedFormat, showGalleryMedia }: GalleryGridProps) {
  // Small randomized reveal delays so cards in the same scroll row pop in
  // scattered rather than perfectly together. Recomputed when the set changes.
  const fadeDelays = useMemo(
    () => banners.map(() => Math.floor(Math.random() * 5) * 60),
    [banners],
  );

  // Static/Video: scroll so the section's header sits at the top of the viewport (just
  // below the sticky top bar) when the section opens — i.e. past the hero.
  const mediaSectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (section !== 'static' && section !== 'video') return;
    const id = setTimeout(() => {
      const el = mediaSectionRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 64; // clear the sticky bar
      window.scrollTo({ top, behavior: 'smooth' });
    }, 120);
    return () => clearTimeout(id);
  }, [section]);

  // Formats section: a catalog of offered ad formats as clickable tabs; the open tab
  // shows a "coming soon" empty-state (no creatives wired for these formats yet).
  if (section === 'formats') {
    // The format is chosen from the flyout menu off the sidebar "Formatlar" button;
    // here we demonstrate that format inside the AntHive desktop browser mock.
    return (
      <section className="px-5 lg:px-12 py-8">
        <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold brand-display text-[#121115]">{t.formatsTitle}</h2>
            <p className="mt-1 text-sm text-[#121115]/60 max-w-2xl">{t.formatsIntro}</p>
          </div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121115] text-[#C47BE4] text-xs font-semibold">
            <LayoutGrid className="w-3.5 h-3.5" /> {selectedFormat}
          </span>
        </div>

        {/* Extra horizontal breathing room around the mock (keeps full height). */}
        <div className="px-2 sm:px-8 lg:px-16 xl:px-24">
          <FormatShowcase format={selectedFormat} az={lang === 'az'} />
        </div>
      </section>
    );
  }

  // Static = real image creatives; Video = real .mp4 creatives. Both render a grid of the
  // assets served from public/ (display-only — no click-through). Filenames may contain
  // spaces/semicolons, so each src is URL-encoded.
  if (section === 'static' || section === 'video') {
    const isVideo = section === 'video';
    const Icon = isVideo ? Video : Image;
    const items = isVideo ? VIDEO_MEDIA : STATIC_MEDIA;

    if (items.length === 0) {
      return (
        <section className="px-5 lg:px-12 py-8">
          <div className="bg-white/30 backdrop-blur-md rounded-3xl p-16 text-center border border-[#121115]/5">
            <Icon className="w-12 h-12 mx-auto text-[#121115]/30 mb-4" />
            <p className="text-lg font-bold mb-2">{isVideo ? t.videoEmptyTitle : t.staticEmptyTitle}</p>
            <p className="text-sm text-[#121115]/60 max-w-md mx-auto">{isVideo ? t.videoEmptyDesc : t.staticEmptyDesc}</p>
          </div>
        </section>
      );
    }

    return (
      <section ref={mediaSectionRef} className="px-5 lg:px-12 py-8 scroll-mt-20">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[11px] uppercase tracking-widest font-bold text-[#121115]/60">
            {items.length} {isVideo ? (lang === 'az' ? 'Video' : 'Videos') : (lang === 'az' ? 'Dizayn' : 'Designs')}
          </p>
        </div>
        {isVideo ? (
          /* Video: exactly PAIRS (2 per row), centered, each pair fitting the width. A
             wider container makes the posts a bit larger while keeping the centered pair
             placement. Proportions preserved by InstagramPost's natural-aspect media. */
          <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((item) => (
              <InstagramPost key={item.src} item={item} isVideo />
            ))}
          </div>
        ) : (
          /* Statik: full-width Instagram masonry (CSS columns), each post at its media's
             natural aspect with no gaps. */
          <div className="columns-1 sm:columns-2 xl:columns-3 gap-6 [column-fill:_balance]">
            {items.map((item) => (
              <div key={item.src} className="mb-6 break-inside-avoid">
                <InstagramPost item={item} isVideo={false} />
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
<section className="px-5 lg:px-12 py-8">
        {/* Results header (banners + the static/video media also shown in this grid) */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[11px] uppercase tracking-widest font-bold text-[#121115]/60">
            {banners.length + (showGalleryMedia ? GALLERY_MEDIA.length : 0)} {lang === 'az' ? 'Dizayn Tapıldı' : 'Designs Found'}
          </p>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#121115]/60">
            <Info className="w-3.5 h-3.5 text-[#856157]" />
            <span>{lang === 'az' ? 'Baxış üçün bannerə klikləyin' : 'Click any banner to preview'}</span>
          </div>
        </div>

        {/* Grid / empty */}
        {banners.length === 0 ? (
          <div className="bg-white/30 backdrop-blur-md rounded-3xl p-16 text-center border border-[#121115]/5">
            <HelpCircle className="w-12 h-12 mx-auto text-[#121115]/30 mb-4 animate-bounce" />
            <p className="text-lg font-bold mb-2">{t.noResults}</p>
            <button onClick={onClearFilters} className="mt-4 px-6 py-3 bg-[#121115] text-[#b4b3ac] rounded-full text-xs font-bold">{t.clearFilters}</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {banners.map((banner, index) => (
              <RevealCard key={banner.id} delay={fadeDelays[index] ?? 0}>
                <BannerCard banner={banner} isFav={favorites.includes(banner.id)} lang={lang} t={t} onOpen={onOpenSandbox} onToggleFavorite={onToggleFavorite} />
              </RevealCard>
            ))}
            {/* Gallery shows EVERYTHING: static images + videos as banner-style cards too
                (only when no filters are active — media has no format/size to filter on). */}
            {showGalleryMedia && GALLERY_MEDIA.map((m, i) => (
              <RevealCard key={m.item.src} delay={(i % 5) * 60}>
                <MediaCard item={m.item} isVideo={m.isVideo} />
              </RevealCard>
            ))}
          </div>
        )}
      </section>
  );
}
