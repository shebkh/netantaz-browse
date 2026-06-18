import { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, SlidersHorizontal, X, Heart, Layers, Image, Video, LayoutGrid, ChevronRight, Check } from 'lucide-react';
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
  formatNames: string[];
  selectedFormat: string;
  onSelectFormat: (name: string) => void;

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
  formatNames,
  selectedFormat,
  onSelectFormat,
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
  // The "Formatlar" flyout menu (opens to the right of the nav button). It's positioned
  // with `fixed` from the button's rect so it isn't clipped by the sidebar's overflow.
  const [formatsOpen, setFormatsOpen] = useState(false);
  const formatsBtnRef = useRef<HTMLButtonElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(null);
  useLayoutEffect(() => {
    if (!formatsOpen) return;
    const btn = formatsBtnRef.current;
    const aside = asideRef.current;
    if (!btn || !aside) return;
    const b = btn.getBoundingClientRect();
    const a = aside.getBoundingClientRect();
    // Anchor to the sidebar PANEL's right edge (not the button's) so the menu sits
    // fully beside the rail instead of overlapping it.
    setFlyoutPos({ top: b.top, left: a.right + 8 });
  }, [formatsOpen]);
  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-[#121115]/50 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      {/* ============ SIDEBAR: navigation + filters ============ */}
      {/* Matte glassmorphism rail: translucent bg + backdrop-blur + subtle border + soft
          shadow. Edge-to-edge off-canvas drawer below 1024px; an inset rounded glass panel
          on desktop. Brand tokens only; the flat greige page bg keeps the blur subtle by design. */}
      <aside ref={asideRef} className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/40 backdrop-blur-2xl border-r border-white/30 shadow-2xl shadow-[#121115]/10 flex flex-col transition-transform duration-300 lg:sticky lg:inset-auto lg:top-4 lg:z-auto lg:m-4 lg:h-[calc(100vh-2rem)] lg:w-64 lg:self-start lg:rounded-3xl lg:border lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
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
            {/* Formatlar only toggles its flyout — it does NOT switch the page. A page
                opens only when a format is picked from the flyout (onSelectFormat). */}
            <button
              ref={formatsBtnRef}
              onClick={() => setFormatsOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={formatsOpen}
              className={navItemClass(section === 'formats')}
            >
              <LayoutGrid className="w-4 h-4" /> {t.navFormats}
              <ChevronRight className={`ml-auto w-4 h-4 transition-transform ${formatsOpen ? 'rotate-90' : ''}`} />
            </button>
          </nav>

          {/* Flyout menu — portaled to <body> so it escapes the sidebar's stacking
              context (backdrop-blur creates one) and renders ABOVE all page content. */}
          {formatsOpen && flyoutPos && createPortal(
            <>
              {/* Click-away backdrop */}
              <div className="fixed inset-0 z-[90]" onClick={() => setFormatsOpen(false)} />
              <ul
                role="menu"
                style={{ top: flyoutPos.top, left: flyoutPos.left }}
                className="fixed z-[100] w-52 max-h-[60vh] overflow-y-auto rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg shadow-[#121115]/10 py-1.5"
              >
                {formatNames.map((name) => {
                  const active = selectedFormat === name && section === 'formats';
                  return (
                    <li key={name} role="none">
                      <button
                        role="menuitem"
                        onClick={() => { onSelectFormat(name); setFormatsOpen(false); }}
                        className={`w-full flex items-center justify-between gap-2 px-4 py-2 text-sm text-left transition-colors ${active ? 'bg-[#121115] text-[#C47BE4]' : 'text-[#121115] hover:bg-[#121115]/5'}`}
                      >
                        <span>{name}</span>
                        {active && <Check className="w-4 h-4 shrink-0" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>,
            document.body,
          )}

          {/* Filters */}
          <div className="mt-7 pt-6 border-t border-[#121115]/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#856157]" />
                <h3 className="text-xs font-normal uppercase tracking-widest">{t.filterTitle}</h3>
              </div>
              <button
                onClick={onClearFilters}
                disabled={!hasActiveFilters}
                className={`text-xs font-normal transition-colors ${hasActiveFilters ? 'text-[#856157] hover:underline cursor-pointer' : 'text-[#121115]/30 cursor-not-allowed'}`}
              >
                {t.clearFilters}
              </button>
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
