import { Search, SlidersHorizontal, X, Heart, Layers } from 'lucide-react';
import type { Lang, TranslationStrings } from '../types';

type SidebarProps = {
  open: boolean; // mobile drawer open
  onClose: () => void;
  onLogoClick: () => void;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  t: TranslationStrings;

  showOnlyFavs: boolean;
  favoritesCount: number;
  onSelectGallery: () => void;
  onSelectFavorites: () => void;

  search: string;
  onSearchChange: (value: string) => void;
  formats: string[];
  sizes: string[];
  categories: string[];
  filterFormat: string;
  onFilterFormat: (value: string) => void;
  filterSize: string;
  onFilterSize: (value: string) => void;
  filterCategory: string;
  onFilterCategory: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

const navItemClass = (active: boolean) =>
  `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-[#121115] text-[#b4b3ac]' : 'text-[#121115] hover:bg-[#121115]/10'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#856157]`;

export default function Sidebar({
  open,
  onClose,
  onLogoClick,
  lang,
  onLangChange,
  t,
  showOnlyFavs,
  favoritesCount,
  onSelectGallery,
  onSelectFavorites,
  search,
  onSearchChange,
  formats,
  sizes,
  categories,
  filterFormat,
  onFilterFormat,
  filterSize,
  onFilterSize,
  filterCategory,
  onFilterCategory,
  hasActiveFilters,
  onClearFilters,
}: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-[#121115]/50 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      {/* ============ SIDEBAR: navigation + filters ============ */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/55 backdrop-blur-xl border-r border-[#121115]/10 flex flex-col transition-transform duration-300 lg:sticky lg:inset-auto lg:top-0 lg:z-auto lg:h-screen lg:self-start lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar p-6">

          {/* Logo + mobile close */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-2xl font-extrabold tracking-tighter brand-display text-[#121115] cursor-pointer" onClick={onLogoClick}>
              net<span className="text-[#856157]">a</span>nt<span className="text-[#77698a] text-base">®</span>
            </span>
            <button onClick={onClose} aria-label={t.close} className="lg:hidden w-8 h-8 rounded-full bg-[#121115]/5 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#856157]"><X className="w-4 h-4" /></button>
          </div>

          {/* Language */}
          <div className="flex bg-[#121115]/10 p-0.5 rounded-full border border-[#121115]/10 text-xs font-bold mb-6 self-start">
            <button onClick={() => onLangChange('az')} className={`px-4 py-1.5 rounded-full transition-all ${lang === 'az' ? 'bg-[#121115] text-[#b4b3ac]' : 'text-[#121115]/60 hover:text-[#121115]'}`}>AZ</button>
            <button onClick={() => onLangChange('en')} className={`px-4 py-1.5 rounded-full transition-all ${lang === 'en' ? 'bg-[#121115] text-[#b4b3ac]' : 'text-[#121115]/60 hover:text-[#121115]'}`}>EN</button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            <button onClick={onSelectGallery} className={navItemClass(!showOnlyFavs)}>
              <Layers className="w-4 h-4" /> {t.navGallery}
            </button>
            <button onClick={onSelectFavorites} className={navItemClass(showOnlyFavs)}>
              <Heart className={`w-4 h-4 ${showOnlyFavs ? 'fill-[#b4b3ac]' : ''}`} /> {t.favorites}
              <span className="ml-auto text-[10px] bg-[#121115]/15 px-2 py-0.5 rounded-full">{favoritesCount}</span>
            </button>
          </nav>

          {/* Filters */}
          <div className="mt-7 pt-6 border-t border-[#121115]/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#856157]" />
                <h3 className="text-xs font-bold uppercase tracking-widest">{t.filterTitle}</h3>
              </div>
              {hasActiveFilters && (
                <button onClick={onClearFilters} className="text-xs text-[#856157] font-semibold hover:underline">{t.clearFilters}</button>
              )}
            </div>

            <div className="relative mb-5">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#121115]/40" />
              <input type="text" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#121115]/10 text-xs focus:outline-none focus:ring-2 focus:ring-[#856157]/30 text-[#121115] placeholder:text-[#121115]/30 transition-all" />
            </div>

            <div className="mb-5">
              <h4 className="text-[11px] font-bold uppercase text-[#121115]/60 mb-2.5 tracking-widest">{t.filterFormat}</h4>
              <div className="flex flex-wrap gap-1.5">
                {formats.map((fmt) => (
                  <button key={fmt} onClick={() => onFilterFormat(fmt)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all ${filterFormat === fmt ? 'bg-[#121115] text-[#b4b3ac]' : 'bg-white hover:bg-white/70 text-[#121115] border border-[#121115]/5'}`}>
                    {fmt === 'All' ? t.all : fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-[11px] font-bold uppercase text-[#121115]/60 mb-2.5 tracking-widest">{t.filterSize}</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {sizes.map((sz) => (
                  <button key={sz} onClick={() => onFilterSize(sz)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all text-left flex items-center justify-between ${filterSize === sz ? 'bg-[#121115] text-[#b4b3ac]' : 'bg-white hover:bg-white/70 text-[#121115] border border-[#121115]/5'}`}>
                    <span>{sz === 'All' ? t.all : sz}</span>
                    {filterSize === sz && <div className="w-1.5 h-1.5 rounded-full bg-[#856157]" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase text-[#121115]/60 mb-2.5 tracking-widest">{t.filterCategory}</h4>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => onFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all ${filterCategory === cat ? 'bg-[#121115] text-[#b4b3ac]' : 'bg-white hover:bg-white/70 text-[#121115] border border-[#121115]/5'}`}>
                    {cat === 'All' ? t.all : cat}
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
