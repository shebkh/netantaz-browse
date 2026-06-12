import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Menu } from 'lucide-react';
import type { Banner, Lang } from '../types';
import { translations } from '../data/translations';
import { INITIAL_BANNERS } from '../data/banners';
import Toast from './Toast';
import Sidebar from './Sidebar';
import GalleryGrid from './GalleryGrid';
import PreviewModal from './PreviewModal';

export default function CreativesGallery() {
  const [lang, setLang] = useState<Lang>('az');
  const [favorites, setFavorites] = useState<string[]>([]);

  const [search, setSearch] = useState('');
  const [filterFormat, setFilterFormat] = useState('All');
  const [filterSize, setFilterSize] = useState('All');
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);

  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer

  // Reliable brand-font loader (an injected @import is often ignored).
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

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

  const formats = ['All', 'HTML5 Animated', 'Rich Media', 'Video Sim', 'Static'];
  const sizes = ['All', '120x600', '160x600', '200x200', '240x400', '300x250', '300x300', '300x600', '320x50', '320x100', '336x280', '468x60', '580x400', '728x90', '930x180', '970x90', '970x250', '1080x1080', '1080x1920', '1500x784'];

  const filteredBanners = useMemo(() => {
    return INITIAL_BANNERS.filter(item => {
      const s = search.toLowerCase();
      const nameMatch = item.title.toLowerCase().includes(s) || item.headline.toLowerCase().includes(s) || (item.headlineEn && item.headlineEn.toLowerCase().includes(s));
      return (search === '' || nameMatch)
        && (filterFormat === 'All' || item.format === filterFormat)
        && (filterSize === 'All' || item.size === filterSize)
        && (!showOnlyFavs || favorites.includes(item.id));
    });
  }, [search, filterFormat, filterSize, showOnlyFavs, favorites]);

  const handleOpenSandbox = (banner: Banner) => { setSelectedBanner(banner); setPreviewDevice('desktop'); };
  const clearFilters = () => { setFilterFormat('All'); setFilterSize('All'); setSearch(''); setShowOnlyFavs(false); };
  const goto = () => { setSidebarOpen(false); };

  const activeTranslations = translations[lang];
  const hasActiveFilters = filterFormat !== 'All' || filterSize !== 'All' || search !== '';

  return (
    <div className="min-h-screen font-sans bg-[#b4b3ac] text-[#121115] selection:bg-[#121115] selection:text-[#b4b3ac]">

      {/* Toast */}
      <Toast message={toastMessage} />

      <div className="relative lg:flex">

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogoClick={goto}
          lang={lang}
          onLangChange={setLang}
          t={activeTranslations}
          showOnlyFavs={showOnlyFavs}
          favoritesCount={favorites.length}
          onSelectGallery={() => { goto(); setShowOnlyFavs(false); }}
          onSelectFavorites={() => { goto(); setShowOnlyFavs(true); }}
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
          <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#b4b3ac]/85 backdrop-blur-xl border-b border-[#121115]/10">
            <button onClick={() => setSidebarOpen(true)} aria-label={lang === 'az' ? 'Menyu' : 'Menu'} className="w-9 h-9 rounded-full bg-[#121115]/5 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#856157]"><Menu className="w-4 h-4" /></button>
            <span className="text-xl font-extrabold tracking-tighter brand-display">net<span className="text-[#856157]">a</span>nt</span>
            <div className="w-9" />
          </div>

          {/* Compact hero */}
          <section className="premium-grain border-b border-[#121115]/10 px-5 lg:px-12 pt-10 pb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#121115]/5 rounded-full text-[11px] font-semibold tracking-widest text-[#121115]/80 uppercase mb-4 border border-[#121115]/10">
              <Sparkles className="w-3.5 h-3.5 text-[#856157] animate-pulse" />
              {activeTranslations.heroSub}
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] brand-display text-[#121115] max-w-3xl">
              {activeTranslations.heroTitlePart1} <span className="gradient-text">{activeTranslations.heroTitleHighlight}</span> {activeTranslations.heroTitlePart2}
            </h1>
            <p className="mt-4 text-sm md:text-base text-[#121115]/70 max-w-2xl leading-relaxed">{activeTranslations.heroDesc}</p>
          </section>

                    <GalleryGrid
            banners={filteredBanners}
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
            <p>Baku, Azerbaijan · info@netant.az</p>
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
