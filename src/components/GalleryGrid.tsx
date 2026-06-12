import { Info, HelpCircle } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { Banner, Lang, TranslationStrings } from '../types';
import BannerCard from './BannerCard';

type GalleryGridProps = {
  banners: Banner[];
  favorites: string[];
  lang: Lang;
  t: TranslationStrings;
  onOpenSandbox: (banner: Banner) => void;
  onToggleFavorite: (id: string, e: MouseEvent) => void;
  onClearFilters: () => void;
};

export default function GalleryGrid({ banners, favorites, lang, t, onOpenSandbox, onToggleFavorite, onClearFilters }: GalleryGridProps) {
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
            {banners.map((banner) => (
              <BannerCard key={banner.id} banner={banner} isFav={favorites.includes(banner.id)} lang={lang} t={t} onOpen={onOpenSandbox} onToggleFavorite={onToggleFavorite} />
            ))}
          </div>
        )}
      </section>
  );
}
