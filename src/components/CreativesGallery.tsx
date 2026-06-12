import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, X, Heart, Smartphone, Monitor, ChevronRight, Info, ArrowUpRight, HelpCircle, Layers, Menu } from 'lucide-react';
import type { Banner, Lang } from '../types';
import { translations } from '../data/translations';
import { INITIAL_BANNERS } from '../data/banners';
import Toast from './Toast';

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

  const navItemClass = (active: boolean) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-[#121115] text-[#b4b3ac]' : 'text-[#121115] hover:bg-[#121115]/10'}`;

  return (
    <div className="min-h-screen font-sans bg-[#b4b3ac] text-[#121115] selection:bg-[#121115] selection:text-[#b4b3ac]">

      {/* Toast */}
      <Toast message={toastMessage} />

      {/* Mobile backdrop */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-[#121115]/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="relative lg:flex">

        {/* ============ SIDEBAR: navigation + filters ============ */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/55 backdrop-blur-xl border-r border-[#121115]/10 flex flex-col transition-transform duration-300 lg:sticky lg:inset-auto lg:top-0 lg:z-auto lg:h-screen lg:self-start lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full overflow-y-auto no-scrollbar p-6">

            {/* Logo + mobile close */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-2xl font-extrabold tracking-tighter brand-display text-[#121115] cursor-pointer" onClick={goto}>
                net<span className="text-[#856157]">a</span>nt<span className="text-[#77698a] text-base">®</span>
              </span>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 rounded-full bg-[#121115]/5 flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>

            {/* Language */}
            <div className="flex bg-[#121115]/10 p-0.5 rounded-full border border-[#121115]/10 text-xs font-bold mb-6 self-start">
              <button onClick={() => setLang('az')} className={`px-4 py-1.5 rounded-full transition-all ${lang === 'az' ? 'bg-[#121115] text-[#b4b3ac]' : 'text-[#121115]/60 hover:text-[#121115]'}`}>AZ</button>
              <button onClick={() => setLang('en')} className={`px-4 py-1.5 rounded-full transition-all ${lang === 'en' ? 'bg-[#121115] text-[#b4b3ac]' : 'text-[#121115]/60 hover:text-[#121115]'}`}>EN</button>
            </div>

            {/* Navigation */}
            <nav className="space-y-1.5">
              <button onClick={() => { goto(); setShowOnlyFavs(false); }} className={navItemClass(!showOnlyFavs)}>
                <Layers className="w-4 h-4" /> {activeTranslations.navGallery}
              </button>
              <button onClick={() => { goto(); setShowOnlyFavs(true); }} className={navItemClass(showOnlyFavs)}>
                <Heart className={`w-4 h-4 ${showOnlyFavs ? 'fill-[#b4b3ac]' : ''}`} /> {activeTranslations.favorites}
                <span className="ml-auto text-[10px] bg-[#121115]/15 px-2 py-0.5 rounded-full">{favorites.length}</span>
              </button>
            </nav>

            {/* Filters */}
            <div className="mt-7 pt-6 border-t border-[#121115]/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#856157]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest">{activeTranslations.filterTitle}</h3>
                </div>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-[#856157] font-semibold hover:underline">{activeTranslations.clearFilters}</button>
                )}
              </div>

              <div className="relative mb-5">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#121115]/40" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={activeTranslations.searchPlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#121115]/10 text-xs focus:outline-none focus:ring-2 focus:ring-[#856157]/30 text-[#121115] placeholder:text-[#121115]/30 transition-all" />
              </div>

              <div className="mb-5">
                <h4 className="text-[11px] font-bold uppercase text-[#121115]/60 mb-2.5 tracking-widest">{activeTranslations.filterFormat}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {formats.map((fmt) => (
                    <button key={fmt} onClick={() => setFilterFormat(fmt)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all ${filterFormat === fmt ? 'bg-[#121115] text-[#b4b3ac]' : 'bg-white hover:bg-white/70 text-[#121115] border border-[#121115]/5'}`}>
                      {fmt === 'All' ? activeTranslations.all : fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <h4 className="text-[11px] font-bold uppercase text-[#121115]/60 mb-2.5 tracking-widest">{activeTranslations.filterSize}</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {sizes.map((sz) => (
                    <button key={sz} onClick={() => setFilterSize(sz)}
                      className={`px-3 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all text-left flex items-center justify-between ${filterSize === sz ? 'bg-[#121115] text-[#b4b3ac]' : 'bg-white hover:bg-white/70 text-[#121115] border border-[#121115]/5'}`}>
                      <span>{sz === 'All' ? activeTranslations.all : sz}</span>
                      {filterSize === sz && <div className="w-1.5 h-1.5 rounded-full bg-[#856157]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase text-[#121115]/60 mb-2.5 tracking-widest">{activeTranslations.filterCategory}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setFilterCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all ${filterCategory === cat ? 'bg-[#121115] text-[#b4b3ac]' : 'bg-white hover:bg-white/70 text-[#121115] border border-[#121115]/5'}`}>
                      {cat === 'All' ? activeTranslations.all : cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </aside>

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

          <section className="px-5 lg:px-12 py-8">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[11px] uppercase tracking-widest font-bold text-[#121115]/60">
                {filteredBanners.length} {lang === 'az' ? 'Dizayn Tapıldı' : 'Designs Found'}
              </p>
              <div className="hidden sm:flex items-center gap-2 text-xs text-[#121115]/60">
                <Info className="w-3.5 h-3.5 text-[#856157]" />
                <span>{lang === 'az' ? 'Baxış üçün bannerə klikləyin' : 'Click any banner to preview'}</span>
              </div>
            </div>

            {/* Grid / empty */}
            {filteredBanners.length === 0 ? (
              <div className="bg-white/30 backdrop-blur-md rounded-3xl p-16 text-center border border-[#121115]/5">
                <HelpCircle className="w-12 h-12 mx-auto text-[#121115]/30 mb-4 animate-bounce" />
                <p className="text-lg font-bold mb-2">{activeTranslations.noResults}</p>
                <button onClick={clearFilters} className="mt-4 px-6 py-3 bg-[#121115] text-[#b4b3ac] rounded-full text-xs font-bold">{activeTranslations.clearFilters}</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {filteredBanners.map((banner) => {
                  const isFav = favorites.includes(banner.id);
                  return (
                    <div key={banner.id} onClick={() => handleOpenSandbox(banner)}
                      className="group bg-[#121115] rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col cursor-pointer border border-white/5">
                      <div className="p-6 bg-stone-900 border-b border-white/5 relative flex items-center justify-center min-h-[300px] overflow-hidden">
                        <div className="absolute inset-0 bg-[#121115] opacity-90"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-tr from-white/5 to-transparent blur-2xl"></div>
                        <div className="relative shadow-2xl transition-all duration-300 group-hover:scale-[1.03] overflow-hidden"
                          style={{ width: `${banner.size.split('x')[0]}px`, height: `${banner.size.split('x')[1]}px`, maxWidth: '100%', maxHeight: '260px', backgroundColor: banner.primaryColor, color: banner.textColor, borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <div className="flex items-center justify-between text-[9px] uppercase tracking-wider opacity-80">
                            <span>{banner.category}</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />{banner.format}</span>
                          </div>
                          <div className="my-auto py-2">
                            <h4 className={`text-sm md:text-base font-bold tracking-tight leading-snug brand-display ${banner.animationSpeed === 'fast' ? 'animate-ad-pulse' : banner.animationSpeed === 'slow' ? 'animate-ad-float' : ''}`}>
                              {lang === 'az' ? banner.headline : banner.headlineEn}
                            </h4>
                            {banner.isSparkle && (
                              <div className="mt-2 flex gap-1 items-center"><div className="w-1 h-1 rounded-full bg-white opacity-40 animate-ping"></div><div className="w-2 h-0.5 bg-white/20 rounded-full"></div></div>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase inline-block" style={{ backgroundColor: banner.textColor, color: banner.primaryColor }}>{lang === 'az' ? banner.cta : banner.ctaEn}</span>
                            <span className="text-[9px] opacity-60 font-semibold">{banner.size}</span>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <button onClick={(e) => toggleFavorite(banner.id, e)} className="w-8 h-8 rounded-full bg-[#121115]/70 backdrop-blur-md flex items-center justify-center text-[#b4b3ac] hover:text-red-400 transition-colors">
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-red-400 text-red-400' : ''}`} />
                          </button>
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <span className="px-5 py-2.5 bg-white text-[#121115] rounded-full text-xs font-bold tracking-wider flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            {activeTranslations.viewDemo}<ArrowUpRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                      <div className="p-6 text-[#b4b3ac] flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <h3 className="text-base font-bold tracking-tight text-white">{banner.title}</h3>
                            <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full text-[#b0a58d] font-bold uppercase tracking-widest">{banner.size}</span>
                          </div>
                          <p className="text-xs text-[#b4b3ac]/75 leading-relaxed line-clamp-2 mb-4">{banner.description}</p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[11px] text-[#b4b3ac]/50 font-semibold">
                          <span>{activeTranslations.formatType}: <strong className="text-white">{banner.format}</strong></span>
                          <span className="flex items-center gap-1 hover:text-white transition-colors">{activeTranslations.viewDemo} <ChevronRight className="w-3.5 h-3.5" /></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

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
