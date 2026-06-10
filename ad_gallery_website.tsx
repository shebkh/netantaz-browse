import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, X, Heart, Smartphone, Monitor, ChevronRight, Info, ArrowUpRight, HelpCircle, Layers, Menu } from 'lucide-react';

const translations = {
  az: {
    heroSub: "YENİ NƏSİL REKLAM QALEREYASI",
    heroTitlePart1: "Yeni Kampaniyanıza",
    heroTitleHighlight: "Salam",
    heroTitlePart2: "deyin",
    heroDesc: "Brendinizin rəqəmsal dünyadakı vizual gücünü kəşf edin. İnteraktiv, sürətli və konversiya yönümlü banner dizaynlarımızın canlandığı unikal platforma.",
    btnMagic: "Bizim Möcüzəmiz ✨",
    btnJoin: "Bizə qoşul",
    navHome: "Ana səhifə",
    navGallery: "Qalereya",
    navAbout: "Haqqımızda",
    navServices: "Xidmətlər",
    navPortfolio: "Portfolio",
    navSupport: "Dəstək",
    navContact: "Əlaqə",
    searchPlaceholder: "Reklam növlərini və ya ölçülərini axtarın...",
    filterTitle: "Filtrlər",
    filterFormat: "Format",
    filterSize: "Ölçü",
    filterCategory: "Kateqoriya",
    all: "Hamısı",
    favorites: "Sevimlilər",
    statsTitle: "Rəqəmlər Bizim Uğuru Hekayəmizi Təsdiq edir",
    statsDesc: "Netant, təsirli nəticələr və davamlı müvəffəqiyyət təqdim etməklə etibar qazanır. Təcrübə və nailiyyətlərlə hədəflərinizi reallığa çeviririk.",
    viewDemo: "İnteraktiv Baxış",
    customizeBtn: "Fərdiləşdir",
    dimension: "Ölçü formatı",
    formatType: "Format növü",
    industry: "Sahə / Sektor",
    noResults: "Axtarışınıza uyğun heç bir banner tapılmadı.",
    clearFilters: "Filtrləri sıfırla",
    editorTitle: "Canlı Reklam Redaktoru",
    editText: "Mətni redaktə et",
    editCta: "CTA Düyməsi",
    editBg: "Fon rəngi",
    previewDevice: "Cihaz Görünüşü",
    mockupPhone: "Mobil Mockup",
    mockupDesktop: "Müstəqil Görünüş",
    applyChanges: "Tətbiq et",
    copied: "Link kopyalandı!",
    exportJson: "Kodu kopyala",
    close: "Bağla",
    featuredBadge: "Seçilmiş Dizayn",
    interactiveLive: "CANLI ANİMASİYA",
    trustedBy: "Bu yüksək səviyyəli brendlərlə əməkdaşlıq edirik",
    footerText: "© 2026 Netant Reklam Qalereyası. Bütün hüquqlar qorunur."
  },
  en: {
    heroSub: "NEXT-GENERATION AD GALLERY",
    heroTitlePart1: "Say",
    heroTitleHighlight: "Hello",
    heroTitlePart2: "to your new Campaign",
    heroDesc: "Discover the visual dominance of your brand in the digital spectrum. A unique interactive platform showcasing state-of-the-art banners with ultra high conversion rates.",
    btnMagic: "Our Magic ✨",
    btnJoin: "Join us",
    navHome: "Home",
    navGallery: "Gallery",
    navAbout: "About Us",
    navServices: "Services",
    navPortfolio: "Portfolio",
    navSupport: "Support",
    navContact: "Contact",
    searchPlaceholder: "Search ad formats, layouts or sizes...",
    filterTitle: "Filters",
    filterFormat: "Format",
    filterSize: "Dimensions",
    filterCategory: "Industry",
    all: "All",
    favorites: "Favorites",
    statsTitle: "Numbers Validate Our Success Story",
    statsDesc: "Netant builds reputation by delivering high impact results and consistent marketing success. We transform your digital vision into performance reality.",
    viewDemo: "Interactive View",
    customizeBtn: "Customize Ad",
    dimension: "Dimensions",
    formatType: "Format Type",
    industry: "Industry / Sector",
    noResults: "No banner ads matched your filtering criteria.",
    clearFilters: "Reset Filters",
    editorTitle: "Live Ad Sandbox Configurator",
    editText: "Edit Ad Headline",
    editCta: "CTA Button Text",
    editBg: "Background Style",
    previewDevice: "Preview Frame",
    mockupPhone: "Mobile Mockup",
    mockupDesktop: "Standalone Canvas",
    applyChanges: "Apply Changes",
    copied: "Link Copied!",
    exportJson: "Copy CSS/JSON",
    close: "Close",
    featuredBadge: "Featured Masterpiece",
    interactiveLive: "LIVE INTERACTIVE PREVIEW",
    trustedBy: "Collaborating with high-tier global brands",
    footerText: "© 2026 Netant Ad Gallery. All rights reserved."
  }
};

const INITIAL_BANNERS = [
  {
    id: "b1",
    title: "Eco Fintech Mobile",
    category: "Fintech",
    format: "HTML5 Animated",
    size: "300x250",
    ratioLabel: "Medium Rectangle",
    primaryColor: "#5d6964", // Sage Green
    accentColor: "#eeddc5",
    textColor: "#ffffff",
    headline: "Gələcəyin yaşıl investisiyası",
    headlineEn: "Invest in the green future",
    cta: "İndi başla",
    ctaEn: "Get Started",
    description: "Elegant green animations ideal for sustainable banking solutions.",
    animationSpeed: "normal",
    isSparkle: true
  },
  {
    id: "b2",
    title: "Premium Sneaker Release",
    category: "Retail",
    format: "Rich Media",
    size: "300x300",
    ratioLabel: "Square Banner",
    primaryColor: "#856157", // Terracotta Rose
    accentColor: "#121115",
    textColor: "#ffffff",
    headline: "Sərhədləri aşan rahatlıq",
    headlineEn: "Comfort beyond boundaries",
    cta: "Kəşf et",
    ctaEn: "Discover Now",
    description: "Smooth continuous carousel ideal for retail conversions and interactive sneaker displays.",
    animationSpeed: "fast",
    isSparkle: true
  },
  {
    id: "b3",
    title: "Minimalist Travel Skyscraper",
    category: "Travel",
    format: "HTML5 Animated",
    size: "160x600",
    ratioLabel: "Wide Skyscraper",
    primaryColor: "#77698a", // Muted Lavender
    accentColor: "#f0ebe1",
    textColor: "#ffffff",
    headline: "Yeni üfüqlər səni çağırır",
    headlineEn: "New horizons are calling",
    cta: "Bilet al",
    ctaEn: "Book Flight",
    description: "Tall aesthetic layout perfect for sidebars, displaying smooth cloud-rise animations.",
    animationSpeed: "slow",
    isSparkle: false
  },
  {
    id: "b4",
    title: "Food Delivery Promo",
    category: "Food",
    format: "Video Sim",
    size: "728x90",
    ratioLabel: "Leaderboard Banner",
    primaryColor: "#a69b85", // Warm Ochre
    accentColor: "#121115",
    textColor: "#121115",
    headline: "20 dəqiqədə isti qapında",
    headlineEn: "Hot at your door in 20 mins",
    cta: "Sifariş et",
    ctaEn: "Order Now",
    description: "Wide panoramic design highlighting rapid fast-food motion graphics.",
    animationSpeed: "fast",
    isSparkle: false
  },
  {
    id: "b5",
    title: "SaaS Cloud Tech",
    category: "Tech",
    format: "HTML5 Animated",
    size: "300x250",
    ratioLabel: "Medium Rectangle",
    primaryColor: "#121115", // Premium Dark Charcoal
    accentColor: "#c2b4a3",
    textColor: "#ffffff",
    headline: "Biznesini süni intellektlə idarə et",
    headlineEn: "Drive your business with AI",
    cta: "Yoxla",
    ctaEn: "Try Free",
    description: "Premium dark theme with sleek neon-glow cyber dots rotating organically.",
    animationSpeed: "normal",
    isSparkle: true
  },
  {
    id: "b6",
    title: "Exclusive Hotel & Spa",
    category: "Travel",
    format: "Static",
    size: "300x300",
    ratioLabel: "Square Banner",
    primaryColor: "#c1b09b", // Soft Beige
    accentColor: "#4a3c31",
    textColor: "#4a3c31",
    headline: "Ruhunuza və bədəninizə dinclik bəxş edin",
    headlineEn: "Pamper your soul and mind",
    cta: "Rezervasiya",
    ctaEn: "Book Now",
    description: "Elegant, minimalist luxury spa layout optimized for high class audiences.",
    animationSpeed: "none",
    isSparkle: false
  },
  {
    id: "b7",
    title: "Crypto Wallet Leaderboard",
    category: "Fintech",
    format: "Rich Media",
    size: "728x90",
    ratioLabel: "Leaderboard Banner",
    primaryColor: "#5d6964", // Sage Green
    accentColor: "#ffffff",
    textColor: "#ffffff",
    headline: "Kripto aktivləriniz vahid məkanda",
    headlineEn: "All crypto assets in one hub",
    cta: "Qoşul",
    ctaEn: "Enter Web3",
    description: "High performance slim ad containing simulated coin pulsing effects.",
    animationSpeed: "fast",
    isSparkle: true
  },
  {
    id: "b8",
    title: "Aesthetic Fashion Mobile Banner",
    category: "Retail",
    format: "HTML5 Animated",
    size: "320x50",
    ratioLabel: "Mobile Banner",
    primaryColor: "#856157", // Terracotta Rose
    accentColor: "#ffffff",
    textColor: "#ffffff",
    headline: "Yeni Kolleksiya 2026",
    headlineEn: "New 2026 Collection",
    cta: "Bax",
    ctaEn: "View",
    description: "Highly compact banner crafted for seamless smartphone integration with slide animations.",
    animationSpeed: "normal",
    isSparkle: false
  }
];

export default function App() {
  const [lang, setLang] = useState('az');
  const [activeTab, setActiveTab] = useState('gallery'); // gallery | stats
  const [favorites, setFavorites] = useState([]);

  const [search, setSearch] = useState('');
  const [filterFormat, setFilterFormat] = useState('All');
  const [filterSize, setFilterSize] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);

  const [selectedBanner, setSelectedBanner] = useState(null);
  const [previewDevice, setPreviewDevice] = useState('desktop');

  const [toastMessage, setToastMessage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer

  // Reliable brand-font loader (an injected @import is often ignored).
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const triggerToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3500); };

  const toggleFavorite = (id, e) => {
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

  const handleOpenSandbox = (banner) => { setSelectedBanner(banner); setPreviewDevice('desktop'); };
  const clearFilters = () => { setFilterFormat('All'); setFilterSize('All'); setFilterCategory('All'); setSearch(''); setShowOnlyFavs(false); };
  const goto = (tab) => { setActiveTab(tab); setSidebarOpen(false); };

  const activeTranslations = translations[lang];
  const hasActiveFilters = filterFormat !== 'All' || filterSize !== 'All' || filterCategory !== 'All' || search !== '';

  const navItemClass = (active) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-[#121115] text-[#b4b3ac]' : 'text-[#121115] hover:bg-[#121115]/10'}`;

  return (
    <div className="min-h-screen font-sans bg-[#b4b3ac] text-[#121115] selection:bg-[#121115] selection:text-[#b4b3ac]">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        body {
          font-family: 'Inter', sans-serif;
        }

        .brand-display {
          font-family: 'Manrope', sans-serif;
        }

        /* Beautiful text-color transitions & blends */
        .gradient-text {
          background: linear-gradient(135deg, #856157 0%, #5d6964 50%, #77698a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
          font-weight: 800;
        }

        /* CSS Animation simulation routines for Live Ad previews */
        @keyframes subtlePulse {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.04); opacity: 1; }
        }

        @keyframes marqueeWave {
          0% { transform: translateX(5%); }
          50% { transform: translateX(-5%); }
          100% { transform: translateX(5%); }
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-ad-pulse {
          animation: subtlePulse 4s ease-in-out infinite;
        }

        .animate-ad-float {
          animation: floatSlow 6s ease-in-out infinite;
        }

        .animate-ad-slide {
          animation: marqueeWave 8s ease-in-out infinite;
        }

        .premium-grain {
          background-image: radial-gradient(rgba(18, 17, 21, 0.05) 1px, transparent 0);
          background-size: 24px 24px;
        }

        /* Hide default scrollbars visually */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[60] bg-[#121115] text-[#b4b3ac] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#b4b3ac]/20 animate-bounce">
          <Sparkles className="w-5 h-5 text-[#b0a58d] animate-spin" />
          <span className="font-semibold text-sm tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Mobile backdrop */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-[#121115]/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="relative lg:flex">

        {/* ============ SIDEBAR: navigation + filters ============ */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/55 backdrop-blur-xl border-r border-[#121115]/10 flex flex-col transition-transform duration-300 lg:sticky lg:inset-auto lg:top-0 lg:z-auto lg:h-screen lg:self-start lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full overflow-y-auto no-scrollbar p-6">

            {/* Logo + mobile close */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-2xl font-extrabold tracking-tighter brand-display text-[#121115] cursor-pointer" onClick={() => goto('gallery')}>
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
              <button onClick={() => { goto('gallery'); setShowOnlyFavs(false); }} className={navItemClass(activeTab === 'gallery' && !showOnlyFavs)}>
                <Layers className="w-4 h-4" /> {activeTranslations.navGallery}
              </button>
              <button onClick={() => { goto('gallery'); setShowOnlyFavs(true); }} className={navItemClass(showOnlyFavs)}>
                <Heart className={`w-4 h-4 ${showOnlyFavs ? 'fill-[#b4b3ac]' : ''}`} /> {activeTranslations.favorites}
                <span className="ml-auto text-[10px] bg-[#121115]/15 px-2 py-0.5 rounded-full">{favorites.length}</span>
              </button>
              <button onClick={() => goto('stats')} className={navItemClass(activeTab === 'stats')}>
                <Info className="w-4 h-4" /> {activeTranslations.navAbout}
              </button>
            </nav>

            {/* Filters — only meaningful on the gallery view */}
            {activeTab === 'gallery' && (
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
            )}

            {/* Contact pinned to bottom */}
            <div className="mt-auto pt-6">
              <button onClick={() => triggerToast(lang === 'az' ? 'Bizimlə əlaqə: info@netant.az' : 'Contact us: info@netant.az')}
                className="w-full px-5 py-3 bg-[#121115] text-[#b4b3ac] rounded-full text-xs font-bold tracking-wider hover:bg-[#856157] transition-all">
                {activeTranslations.navContact}
              </button>
            </div>

          </div>
        </aside>

        {/* ============ MAIN: gallery / stats ============ */}
        <main className="min-w-0 flex-1">

          {/* Mobile top bar */}
          <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#b4b3ac]/85 backdrop-blur-xl border-b border-[#121115]/10">
            <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-full bg-[#121115]/5 flex items-center justify-center"><Menu className="w-4 h-4" /></button>
            <span className="text-xl font-extrabold tracking-tighter brand-display">net<span className="text-[#856157]">a</span>nt</span>
            <div className="w-9" />
          </div>

          {activeTab === 'gallery' && (
            <>
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
                {/* Trust bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#121115] text-[#b4b3ac] p-5 rounded-3xl">
                  <p className="text-[11px] uppercase opacity-60 tracking-wider font-semibold">{activeTranslations.trustedBy}</p>
                  <div className="flex items-center gap-5 overflow-x-auto no-scrollbar opacity-70 hover:opacity-100 transition-opacity">
                    {['ADVERT','POSTER','MEDIAFORCE','CARAT','SMARTBEE'].map(b => (
                      <span key={b} className="font-bold tracking-wider text-xs whitespace-nowrap">{b}</span>
                    ))}
                  </div>
                </div>

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
            </>
          )}

          {activeTab === 'stats' && (
            <section className="px-5 lg:px-12 py-10">
              <div className="bg-[#121115] text-[#b4b3ac] p-8 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#856157]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#77698a]/15 rounded-full blur-3xl"></div>
                <div className="max-w-3xl relative z-10 mb-12">
                  <span className="inline-block px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-bold tracking-widest text-[#b0a58d] uppercase mb-6 border border-white/10">{lang === 'az' ? 'MÜVƏFFƏQİYYƏTİMİZ' : 'OUR TRACK RECORD'}</span>
                  <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight brand-display text-white leading-tight mb-6">Rəqəmlər <span className="gradient-text">Bizim Uğuru</span> Hekayəmizi Təsdiq edir</h2>
                  <p className="text-sm md:text-base text-[#b4b3ac]/80 leading-relaxed font-light">{activeTranslations.statsDesc}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
                  {[
                    { c:'#856157', n:'5M+',  t: lang==='az'?'Aylıq Göstərilmə':'Monthly Impressions', d: lang==='az'?'Tərəfdaş şəbəkələrdə':'Across premium ad slots' },
                    { c:'#5d6964', n:'92%',  t: lang==='az'?'Konversiya Artımı':'Conversion Increase', d: lang==='az'?'Optimallaşdırılmış CTR':'Tested across dynamic CTRs' },
                    { c:'#a69b85', n:'14+',  t: lang==='az'?'Qlobal Mükafatlar':'Global Ad Awards', d: lang==='az'?'Yaradıcı dizaynlar':'Outstanding visual designs' },
                    { c:'#77698a', n:'200+', t: lang==='az'?'Aktiv Partnyor':'Active Partners', d: lang==='az'?'Bizə etibar edən brendlər':'Brands that trust us' },
                  ].map((s) => (
                    <div key={s.n} style={{ backgroundColor: s.c }} className="text-[#121115] p-8 rounded-[2rem] hover:scale-[1.03] transition-transform duration-300 shadow-xl flex flex-col justify-between min-h-[180px]">
                      <span className="text-5xl md:text-6xl font-black tracking-tight brand-display text-white">{s.n}</span>
                      <div><h4 className="text-base font-bold text-white mb-1">{s.t}</h4><p className="text-xs text-white/70">{s.d}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

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
