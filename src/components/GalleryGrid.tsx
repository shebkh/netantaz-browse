import { useMemo, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Info, HelpCircle, Video, Image } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { Banner, Lang, TranslationStrings } from '../types';
import type { GallerySection } from './CreativesGallery';
import BannerCard from './BannerCard';

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
};

export default function GalleryGrid({ banners, section, favorites, lang, t, onOpenSandbox, onToggleFavorite, onClearFilters }: GalleryGridProps) {
  // Small randomized reveal delays so cards in the same scroll row pop in
  // scattered rather than perfectly together. Recomputed when the set changes.
  const fadeDelays = useMemo(
    () => banners.map(() => Math.floor(Math.random() * 5) * 60),
    [banners],
  );

  // Static and Video are intentionally-empty sections for now: each shows its
  // own "coming soon" empty-state instead of a grid.
  if (section === 'static' || section === 'video') {
    const isVideo = section === 'video';
    const Icon = isVideo ? Video : Image;
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
<section className="px-5 lg:px-12 py-8">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[11px] uppercase tracking-widest font-bold text-[#121115]/60">
            {banners.length} {lang === 'az' ? 'Dizayn Tapıldı' : 'Designs Found'}
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
          </div>
        )}
      </section>
  );
}
