import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, X, Smartphone, Monitor, Menu } from 'lucide-react';
import type { Banner, Lang } from '../types';
import { translations } from '../data/translations';
import { INITIAL_BANNERS } from '../data/banners';
import Toast from './Toast';
import Sidebar from './Sidebar';
import GalleryGrid from './GalleryGrid';

export default function CreativesGallery() {
  const [lang, setLang] = useState<Lang>('az');
  const [favorites, setFavorites] = useState<string[]>([]);

  const [search, setSearch] = useState('');
  const [filterFormat, setFilterFormat] = useState('All');
  const [filterSize, setFilterSize] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
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
  const sizes = ['All', '300x250', '300x300', '160x600', '728x90', '320x50'];
  const categories = ['All', 'Fintech', 'Retail', 'Travel', 'Food', 'Tech'];

  const filteredBanners = useMemo(() => {
    return INITIAL_BANNERS.filter(item => {
      const s = search.toLowerCase();
      const nameMatch = item.title.toLowerCase().includes(s) || item.headline.toLowerCase().includes(s) || (item.headlineEn && item.headlineEn.toLowerCase().includes(s));
      return (search === '' || nameMatch)
        && (filterFormat === 'All' || item.format === filterFormat)
        && (filterSize === 'All' || item.size === filterSize)
        && (filterCategory === 'All' || item.category === filterCategory)
        && (!showOnlyFavs || favorites.includes(item.id));
    });
  }, [search, filterFormat, filterSize, filterCategory, showOnlyFavs, favorites]);

  const handleOpenSandbox = (banner: Banner) => { setSelectedBanner(banner); setPreviewDevice('desktop'); };
  const clearFilters = () => { setFilterFormat('All'); setFilterSize('All'); setFilterCategory('All'); setSearch(''); setShowOnlyFavs(false); };
  const goto = () => { setSidebarOpen(false); };

  const activeTranslations = translations[lang];
  const hasActiveFilters = filterFormat !== 'All' || filterSize !== 'All' || filterCategory !== 'All' || search !== '';

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
          categories={categories}
          filterFormat={filterFormat}
          onFilterFormat={setFilterFormat}
          filterSize={filterSize}
          onFilterSize={setFilterSize}
          filterCategory={filterCategory}
          onFilterCategory={setFilterCategory}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        {/* ============ MAIN: gallery ============ */}
        <main className="min-w-0 flex-1">

          {/* Mobile top bar */}
          <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#b4b3ac]/85 backdrop-blur-xl border-b border-[#121115]/10">
            <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-full bg-[#121115]/5 flex items-center justify-center"><Menu className="w-4 h-4" /></button>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121115]/90 backdrop-blur-xl overflow-y-auto"
          onClick={() => setSelectedBanner(null)}
        >
          <div
            className="bg-white rounded-[2.5rem] shadow-2xl max-w-3xl w-full overflow-hidden border border-[#121115]/10 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Header */}
            <div className="flex items-start justify-between gap-4 p-6 border-b border-[#121115]/10">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#856157] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  {activeTranslations.interactiveLive}
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight brand-display text-[#121115]">{selectedBanner.title}</h3>
                <p className="text-xs text-[#121115]/55 mt-0.5">{selectedBanner.ratioLabel} · {selectedBanner.size}</p>
              </div>
              <button
                onClick={() => setSelectedBanner(null)}
                aria-label={activeTranslations.close}
                className="shrink-0 w-9 h-9 rounded-full bg-[#121115]/5 hover:bg-[#121115]/10 flex items-center justify-center transition-colors text-[#121115]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Canvas */}
            <div className="bg-[#b4b3ac] p-6 sm:p-8 overflow-y-auto">

              {/* Device switcher */}
              <div className="flex items-center justify-end mb-6">
                <div className="flex bg-white/80 p-1 rounded-full border border-[#121115]/10 text-xs">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${previewDevice === 'desktop' ? 'bg-[#121115] text-white' : 'text-[#121115]/60 hover:text-[#121115]'}`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{activeTranslations.mockupDesktop}</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${previewDevice === 'mobile' ? 'bg-[#121115] text-white' : 'text-[#121115]/60 hover:text-[#121115]'}`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{activeTranslations.mockupPhone}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center py-4">
                {previewDevice === 'mobile' ? (
                  /* Phone mockup */
                  <div className="relative mx-auto w-[290px] h-[550px] bg-[#121115] rounded-[3rem] p-3.5 shadow-2xl border-4 border-stone-800 flex flex-col justify-between">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-stone-800 rounded-b-2xl z-20 flex items-center justify-center">
                      <div className="w-10 h-1 bg-black rounded-full mb-1"></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-white/40 px-3 pt-2">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-white/40"></span>
                        <span className="w-3.5 h-2 bg-white/40 rounded-sm"></span>
                      </div>
                    </div>
                    <div className="flex-grow my-4 bg-stone-900 rounded-2xl overflow-y-auto p-4 flex flex-col justify-center items-center border border-white/5 relative">
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest text-white/25">
                        {lang === 'az' ? 'Simulyasiya' : 'Simulated Web Feed'}
                      </div>
                      <div
                        className="shadow-xl"
                        style={{
                          width: `${selectedBanner.size.split('x')[0]}px`,
                          height: `${selectedBanner.size.split('x')[1]}px`,
                          maxWidth: '100%', maxHeight: '340px',
                          backgroundColor: selectedBanner.primaryColor,
                          color: selectedBanner.textColor,
                          borderRadius: '16px', display: 'flex', flexDirection: 'column',
                          justifyContent: 'space-between', padding: '16px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)'
                        }}
                      >
                        <div className="flex items-center justify-between text-[9px] uppercase tracking-wider opacity-85">
                          <span>{selectedBanner.category}</span>
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            {selectedBanner.format}
                          </span>
                        </div>
                        <div className="my-auto py-2">
                          <h4 className="text-xs sm:text-sm font-bold tracking-tight leading-snug brand-display animate-ad-pulse">
                            {lang === 'az' ? selectedBanner.headline : selectedBanner.headlineEn}
                          </h4>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="px-3 py-1.5 rounded-full text-[9px] font-bold tracking-wide uppercase inline-block"
                            style={{ backgroundColor: selectedBanner.textColor, color: selectedBanner.primaryColor }}>
                            {lang === 'az' ? selectedBanner.cta : selectedBanner.ctaEn}
                          </span>
                          <span className="text-[9px] opacity-65 font-mono">{selectedBanner.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-20 h-1 bg-white/20 rounded-full mx-auto mb-1"></div>
                  </div>
                ) : (
                  /* Desktop frame */
                  <div className="bg-white/60 p-8 sm:p-12 rounded-[2rem] border border-[#121115]/5 shadow-sm max-w-full flex items-center justify-center">
                    <div
                      className="shadow-2xl"
                      style={{
                        width: `${selectedBanner.size.split('x')[0]}px`,
                        height: `${selectedBanner.size.split('x')[1]}px`,
                        maxWidth: '100%',
                        backgroundColor: selectedBanner.primaryColor,
                        color: selectedBanner.textColor,
                        borderRadius: '20px', display: 'flex', flexDirection: 'column',
                        justifyContent: 'space-between', padding: '24px',
                        boxShadow: '0 25px 50px -12px rgba(18, 17, 21, 0.25)'
                      }}
                    >
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider opacity-85">
                        <span>{selectedBanner.category}</span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                          {selectedBanner.format}
                        </span>
                      </div>
                      <div className="my-auto py-4">
                        <h4 className="text-base sm:text-lg font-bold tracking-tight leading-snug brand-display animate-ad-pulse">
                          {lang === 'az' ? selectedBanner.headline : selectedBanner.headlineEn}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase inline-block"
                          style={{ backgroundColor: selectedBanner.textColor, color: selectedBanner.primaryColor }}>
                          {lang === 'az' ? selectedBanner.cta : selectedBanner.ctaEn}
                        </span>
                        <span className="text-[10px] opacity-65 font-mono">{selectedBanner.size}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Details footer */}
            <div className="p-6 border-t border-[#121115]/10">
              <p className="text-sm text-[#121115]/70 leading-relaxed">{selectedBanner.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#121115]/70">
                <span className="px-3 py-1 rounded-full bg-[#121115]/5">{selectedBanner.category}</span>
                <span className="px-3 py-1 rounded-full bg-[#121115]/5">{selectedBanner.format}</span>
                <span className="px-3 py-1 rounded-full bg-[#121115]/5">{selectedBanner.size}</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
