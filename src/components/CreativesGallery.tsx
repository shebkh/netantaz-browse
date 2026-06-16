import React, { useState, useMemo } from 'react';
import { Sparkles, Menu } from 'lucide-react';
import type { Banner, Lang } from '../types';
import { translations } from '../data/translations';
import { INITIAL_BANNERS } from '../data/banners';
import Toast from './Toast';
import Sidebar from './Sidebar';
import GalleryGrid from './GalleryGrid';
import PreviewModal from './PreviewModal';
import type { PreviewDevice } from './PreviewModal';

// Which sidebar browsing section is active.
export type GallerySection = 'gallery' | 'favorites' | 'static' | 'video';

export default function CreativesGallery() {
  const [lang, setLang] = useState<Lang>('az');
  const [favorites, setFavorites] = useState<string[]>([]);

  const [search, setSearch] = useState('');
  const [filterFormat, setFilterFormat] = useState('All');
  const [filterSize, setFilterSize] = useState('All');
  // Active browsing section. 'static' groups image banners; 'video' is an
  // intentionally-empty section (empty-state only); 'favorites' filters to faves.
  const [section, setSection] = useState<GallerySection>('gallery');
  const showOnlyFavs = section === 'favorites';

  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer

  const triggerToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3500); };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
      triggerToast(lang === 'az' ? 'Sevimlilərdən çıxarıldı' : 'Removed from favorites');
    } else {
      setFavorites([...favorites, id]);
      triggerToast(lang === 'az' ? 'Sevimlilərə əlavə edildi! ❤️' : 'Added to favorites! ❤️');
    }
  };

  // Display-only format merge: collapse the "Weather Banner *" variants into one
  // "Weather" chip. Maps a raw format to its displayed label; the filter predicate
  // matches on the label so selecting "Weather" matches all weather variants. No
  // `format` data is edited.
  const formatLabel = (format: string) => (format.startsWith('Weather Banner') ? 'Weather' : format);

  // Curated "Interaktiv" group (display-only): a fixed set of banner ids surfaced
  // under one Format chip. The 4 "Rich Media" banners share format "Rich Media".
  const INTERAKTIV_IDS = new Set(['turan-bank', 'nar', 'netflix-banner', 'rich-media', 'rich-media-2', 'rich-media-3', 'rich-media-4']);
  const matchesFormat = (b: Banner) =>
    filterFormat === 'All' || (filterFormat === 'Interaktiv' ? INTERAKTIV_IDS.has(b.id) : formatLabel(b.format) === filterFormat);

  // Filter options: data-derived labels (post-merge), plus the curated "Interaktiv"
  // bucket. The individual formats now merged under "Interaktiv" are hidden from the
  // chip row so those banners are only reachable via that chip. "Animated"/"Video"
  // buckets removed per request.
  const MERGED_INTO_INTERAKTIV = new Set(['Nar', 'Netflix Banner', 'Turan Bank', 'Rich Media']);
  const formats = [
    'All',
    ...Array.from(new Set(INITIAL_BANNERS.map((b) => formatLabel(b.format)).filter((f) => !MERGED_INTO_INTERAKTIV.has(f)).sort())),
    'Interaktiv',
  ];
  const sizes = [
    'All',
    ...Array.from(new Set(INITIAL_BANNERS.map((b) => b.size))).sort((a, b) => {
      const [aw, ah] = a.split('x').map(Number);
      const [bw, bh] = b.split('x').map(Number);
      return aw - bw || ah - bh;
    }),
  ];

  const filteredBanners = useMemo(() => {
    const matched = INITIAL_BANNERS.filter(item => {
      const s = search.toLowerCase();
      const nameMatch = item.title.toLowerCase().includes(s) || item.format.toLowerCase().includes(s) || item.category.toLowerCase().includes(s);
      return (search === '' || nameMatch)
        && matchesFormat(item)
        && (filterSize === 'All' || item.size === filterSize)
        && (!showOnlyFavs || favorites.includes(item.id));
    });
    // Showcase order: animated creatives (live HTML5 demos) lead, then static images.
    // Sort a copy in the render path with a stable key so within-group order is preserved;
    // never mutate INITIAL_BANNERS.
    const isAnimated = (b: Banner) => b.preview.kind === 'demo';
    return matched
      .map((banner, index) => ({ banner, index }))
      .sort((a, b) => (isAnimated(b.banner) ? 1 : 0) - (isAnimated(a.banner) ? 1 : 0) || a.index - b.index)
      .map(({ banner }) => banner);
  }, [search, filterFormat, filterSize, showOnlyFavs, favorites, section]);

  const handleOpenSandbox = (banner: Banner) => { setSelectedBanner(banner); setPreviewDevice('desktop'); };
  const clearFilters = () => { setFilterFormat('All'); setFilterSize('All'); setSearch(''); setSection('gallery'); };
  const goto = () => { setSidebarOpen(false); };

  const activeTranslations = translations[lang];
  const hasActiveFilters = filterFormat !== 'All' || filterSize !== 'All' || search !== '';

  return (
    <div className="min-h-screen font-sans bg-[#f0ede1] text-[#121115] selection:bg-[#121115] selection:text-[#b4b3ac]">

      {/* Toast */}
      <Toast message={toastMessage} />

      <div className="relative lg:flex">

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          lang={lang}
          onLangChange={setLang}
          t={activeTranslations}
          section={section}
          favoritesCount={favorites.length}
          onSelectGallery={() => { goto(); setSection('gallery'); }}
          onSelectFavorites={() => { goto(); setSection('favorites'); }}
          onSelectStatic={() => { goto(); setSection('static'); }}
          onSelectVideo={() => { goto(); setSection('video'); }}
          search={search}
          onSearchChange={setSearch}
          formats={formats}
          sizes={sizes}
          filterFormat={filterFormat}
          onFilterFormat={setFilterFormat}
          filterSize={filterSize}
          onFilterSize={setFilterSize}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        {/* ============ MAIN: gallery ============ */}
        <main className="min-w-0 flex-1">

          {/* Mobile top bar */}
          <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#f0ede1]/85 backdrop-blur-xl border-b border-[#121115]/10">
            <button onClick={() => setSidebarOpen(true)} aria-label={lang === 'az' ? 'Menyu' : 'Menu'} className="w-9 h-9 rounded-full bg-[#121115]/5 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#856157]"><Menu className="w-4 h-4" /></button>
            <div className="w-9" />
          </div>

          {/* Compact hero */}
          <section className="premium-grain border-b border-[#121115]/10 px-5 lg:px-12 pt-10 pb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#121115]/5 rounded-full text-[11px] font-semibold tracking-widest text-[#121115]/80 uppercase mb-4 border border-[#121115]/10">
              <Sparkles className="w-3.5 h-3.5 text-[#856157] animate-pulse" />
              {activeTranslations.heroSub}
            </span>
            <h1 className="hero-rise text-3xl md:text-5xl font-black tracking-tight leading-[1.05] brand-display text-[#121115] max-w-3xl">
              {activeTranslations.heroTitlePart1} <span className="gradient-text">{activeTranslations.heroTitleHighlight}</span> {activeTranslations.heroTitlePart2}
            </h1>
            <p className="mt-4 text-sm md:text-base text-[#121115]/70 max-w-2xl leading-relaxed">{activeTranslations.heroDesc}</p>
          </section>

                    <GalleryGrid
            banners={filteredBanners}
            section={section}
            favorites={favorites}
            lang={lang}
            t={activeTranslations}
            onOpenSandbox={handleOpenSandbox}
            onToggleFavorite={toggleFavorite}
            onClearFilters={clearFilters}
          />

          {/* Slim footer */}
          <footer className="px-5 lg:px-12 py-8 border-t border-[#121115]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#121115]/55 font-semibold">
            <p>{activeTranslations.footerText}</p>
            <p>Baku, Azerbaijan</p>
          </footer>

        </main>
      </div>

{/* Interactive Preview Modal (view-only) */}
      {selectedBanner && (
        <PreviewModal
          banner={selectedBanner}
          device={previewDevice}
          onDeviceChange={setPreviewDevice}
          onClose={() => setSelectedBanner(null)}
          lang={lang}
          t={activeTranslations}
        />
      )}

    </div>
  );
}
