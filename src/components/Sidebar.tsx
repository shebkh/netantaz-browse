import { Search, SlidersHorizontal, X, Heart, Layers, Image, Video } from 'lucide-react';
import type { TranslationStrings } from '../types';
import type { GallerySection } from './CreativesGallery';

type SidebarProps = {
  open: boolean; // mobile drawer open
  onClose: () => void;
  t: TranslationStrings;

  section: GallerySection;
  favoritesCount: number;
  onSelectGallery: () => void;
  onSelectFavorites: () => void;
  onSelectStatic: () => void;
  onSelectVideo: () => void;

  search: string;
  onSearchChange: (value: string) => void;
  formats: string[];
  sizes: string[];
  filterFormat: string;
  onFilterFormat: (value: string) => void;
  filterSize: string;
  onFilterSize: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

const navItemClass = (active: boolean) =>
  `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-normal transition-all ${active ? 'bg-[#121115] text-[#C47BE4]' : 'text-[#121115] hover:bg-[#121115]/10'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#856157]`;

export default function Sidebar({
  open,
  onClose,
  t,
  section,
  favoritesCount,
  onSelectGallery,
  onSelectFavorites,
  onSelectStatic,
  onSelectVideo,
  search,
  onSearchChange,
  formats,
  sizes,
  filterFormat,
  onFilterFormat,
  filterSize,
  onFilterSize,
  hasActiveFilters,
  onClearFilters,
}: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-[#121115]/50 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      {/* ============ SIDEBAR: navigation + filters ============ */}
      {/* Matte glassmorphism rail: translucent bg + backdrop-blur + subtle border + soft
          shadow. Edge-to-edge off-canvas drawer below 1024px; an inset rounded glass panel
          on desktop. Brand tokens only; the flat greige page bg keeps the blur subtle by design. */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/40 backdrop-blur-2xl border-r border-white/30 shadow-2xl shadow-[#121115]/10 flex flex-col transition-transform duration-300 lg:sticky lg:inset-auto lg:top-4 lg:z-auto lg:m-4 lg:h-[calc(100vh-2rem)] lg:w-64 lg:self-start lg:rounded-3xl lg:border lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar p-6">

          {/* Mobile close (wordmark removed per request) */}
          <div className="flex items-center justify-end mb-6">
            <button onClick={onClose} aria-label={t.close} className="lg:hidden w-8 h-8 rounded-full bg-[#121115]/5 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#856157]"><X className="w-4 h-4" /></button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            <button onClick={onSelectGallery} className={navItemClass(section === 'gallery')}>
              <Layers className="w-4 h-4" /> {t.navGallery}
            </button>
            <button onClick={onSelectStatic} className={navItemClass(section === 'static')}>
              <Image className="w-4 h-4" /> {t.navStatic}
            </button>
            <button onClick={onSelectVideo} className={navItemClass(section === 'video')}>
              <Video className="w-4 h-4" /> {t.navVideo}
            </button>
            <button onClick={onSelectFavorites} className={navItemClass(section === 'favorites')}>
              <Heart className={`w-4 h-4 ${section === 'favorites' ? 'fill-[#C47BE4]' : ''}`} /> {t.favorites}
              <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${section === 'favorites' ? 'bg-white/15' : 'bg-[#121115]/15'}`}>{favoritesCount}</span>
            </button>
          </nav>

          {/* Filters */}
          <div className="mt-7 pt-6 border-t border-[#121115]/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#856157]" />
                <h3 className="text-xs font-normal uppercase tracking-widest">{t.filterTitle}</h3>
              </div>
              {hasActiveFilters && (
                <button onClick={onClearFilters} className="text-xs text-[#856157] font-normal hover:underline">{t.clearFilters}</button>
              )}
            </div>

            {/* Animated colorful ring while typing; static border when empty. */}
            <div className={`relative mb-5 rounded-2xl p-px transition-all ${search ? 'search-typing shadow-md shadow-[#856157]/15' : 'bg-[#121115]/10'}`}>
              <div className="relative rounded-2xl bg-white">
                <Search className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${search ? 'text-[#856157]' : 'text-[#121115]/40'}`} />
                <input type="text" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder={t.searchPlaceholder}
                  className="search-typing-field w-full pl-10 pr-4 py-3 rounded-2xl bg-transparent text-xs focus:outline-none text-[#121115] placeholder:text-[#121115]/30 transition-all" />
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-[11px] font-normal uppercase text-[#121115]/60 mb-2.5 tracking-widest">{t.filterFormat}</h4>
              <div className="flex flex-wrap gap-1.5">
                {formats.map((fmt) => (
                  <button key={fmt} onClick={() => onFilterFormat(fmt)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-normal tracking-wide transition-all ${filterFormat === fmt ? 'bg-[#121115] text-[#C47BE4]' : 'bg-white hover:bg-white/70 text-[#121115] border border-[#121115]/5'}`}>
                    {fmt === 'All' ? t.all : fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-[11px] font-normal uppercase text-[#121115]/60 mb-2.5 tracking-widest">{t.filterSize}</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {sizes.map((sz) => (
                  <button key={sz} onClick={() => onFilterSize(sz)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-normal tracking-wide transition-all text-left flex items-center justify-between ${filterSize === sz ? 'bg-[#121115] text-[#C47BE4]' : 'bg-white hover:bg-white/70 text-[#121115] border border-[#121115]/5'}`}>
                    <span>{sz === 'All' ? t.all : sz}</span>
                    {filterSize === sz && <div className="w-1.5 h-1.5 rounded-full bg-[#C47BE4]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}
