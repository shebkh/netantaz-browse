import { Heart, ArrowUpRight, ChevronRight } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { Banner, Lang, TranslationStrings } from '../types';
import BannerPreview from './BannerPreview';

type BannerCardProps = {
  banner: Banner;
  isFav: boolean;
  lang: Lang;
  t: TranslationStrings;
  onOpen: (banner: Banner) => void;
  onToggleFavorite: (id: string, e: MouseEvent) => void;
};

export default function BannerCard({ banner, isFav, lang, t, onOpen, onToggleFavorite }: BannerCardProps) {
  return (
    <div
      onClick={() => onOpen(banner)}
      role="button"
      tabIndex={0}
      aria-label={banner.title}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(banner); } }}
      className="group bg-[#121115] rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col cursor-pointer border border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#856157]">
      <div className="p-6 bg-stone-900 border-b border-white/5 relative flex items-center justify-center min-h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-[#121115] opacity-90"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-tr from-white/5 to-transparent blur-2xl"></div>
        <div className="relative shadow-2xl transition-all duration-300 group-hover:scale-[1.03]">
          <BannerPreview banner={banner} maxHeight={260} />
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button onClick={(e) => onToggleFavorite(banner.id, e)} aria-label={lang === 'az' ? (isFav ? 'Sevimlilərdən çıxar' : 'Sevimlilərə əlavə et') : (isFav ? 'Remove from favorites' : 'Add to favorites')} className="w-8 h-8 rounded-full bg-[#121115]/70 backdrop-blur-md flex items-center justify-center text-[#b4b3ac] hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#856157]">
            <Heart className={`w-4 h-4 ${isFav ? 'fill-red-400 text-red-400' : ''}`} />
          </button>
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] pointer-events-none">
          <span className="px-5 py-2.5 bg-white text-[#121115] rounded-full text-xs font-bold tracking-wider flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            {t.viewDemo}<ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
      <div className="p-6 text-[#b4b3ac] flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-base font-bold tracking-tight text-white">{banner.size}</h3>
            <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full text-[#b0a58d] font-bold uppercase tracking-widest">{banner.size}</span>
          </div>
          <p className="text-xs text-[#b4b3ac]/75 leading-relaxed line-clamp-2 mb-4">{banner.description}</p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[11px] text-[#b4b3ac]/50 font-semibold">
          <span>{t.formatType}: <strong className="text-white">{banner.format}</strong></span>
          <span className="flex items-center gap-1 hover:text-white transition-colors">{t.viewDemo} <ChevronRight className="w-3.5 h-3.5" /></span>
        </div>
      </div>
    </div>
  );
}
