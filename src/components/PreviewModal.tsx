import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { X, Smartphone, Globe } from 'lucide-react';
import type { Banner, Lang, TranslationStrings } from '../types';

// The preview frames the modal can switch between. Exported so the parent's
// device state stays in sync with this component.
export type PreviewDevice = 'mobile' | 'website';

type PreviewModalProps = {
  banner: Banner;
  device: PreviewDevice;
  onDeviceChange: (device: PreviewDevice) => void;
  onClose: () => void;
  lang: Lang;
  t: TranslationStrings;
};

// Renders the LIVE creative inside a mockup: a static image, or the HTML5 demo in a
// sandboxed iframe (sandbox="allow-scripts" per spec — interactive here, unlike the
// grid's non-interactive BannerPreview). Sized to (close to) the banner's native size.
// Renders the creative at its NATIVE pixel size, then uniformly CSS-scales it to fit
// within maxWidth × maxHeight. Scaling (never upscale past 1×) keeps the exact aspect
// ratio — an iframe renders its content at fixed px, so transform:scale is the only way
// to shrink HTML5 demos without distorting them. The outer box reserves the scaled
// footprint so surrounding page layout stays correct.
function LiveCreative({ banner, maxWidth, maxHeight }: { banner: Banner; maxWidth: number; maxHeight: number }) {
  const [w, h] = banner.size.split('x').map(Number);
  const nativeW = w || 300;
  const nativeH = h || 250;
  const scale = Math.min(1, maxWidth / nativeW, maxHeight / nativeH);

  // Footprint after scaling — this is what occupies space on the page.
  const outer: CSSProperties = {
    width: `${nativeW * scale}px`,
    height: `${nativeH * scale}px`,
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  };
  // The creative drawn at native px then scaled down from the top-left corner.
  const inner: CSSProperties = {
    width: `${nativeW}px`,
    height: `${nativeH}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    display: 'block',
    border: '0',
  };

  return (
    <div style={outer}>
      {banner.preview.kind === 'image' ? (
        <img src={banner.preview.src} alt={banner.title} loading="lazy" style={{ ...inner, objectFit: 'contain' }} />
      ) : (
        <iframe
          src={banner.preview.src}
          title={banner.title}
          loading="lazy"
          scrolling="no"
          sandbox="allow-scripts"
          style={inner}
        />
      )}
    </div>
  );
}

// How a creative gets placed on the page, derived from its proportions:
//  - 'horizontal' (wide strips) run full-width at the top or bottom.
//  - 'vertical' (tall skyscrapers) and 'rectangle' (MREC / square) live in the side
//    column, on the left or right.
type Orientation = 'horizontal' | 'vertical' | 'rectangle';
type Edge = 'top' | 'bottom';
type Side = 'left' | 'right';

function orientationForSize(size: string): Orientation {
  const [w, h] = size.split('x').map(Number);
  if (!w || !h) return 'rectangle';
  const ratio = w / h;
  // Clearly wider than tall → horizontal strip (leaderboard / billboard / mobile anchor).
  if (ratio >= 1.6) return 'horizontal';
  // Clearly taller than wide → vertical skyscraper / half-page.
  if (ratio <= 0.7) return 'vertical';
  // Everything roughly square or modestly rectangular → in-column rectangle (MREC).
  return 'rectangle';
}

// Deterministic top/bottom and left/right picks (no Math.random in this env): hash the
// size string so a given banner always lands in the same spot, but different sizes vary.
function sizeHash(size: string): number {
  let acc = 0;
  for (let i = 0; i < size.length; i++) acc = (acc + size.charCodeAt(i)) % 997;
  return acc;
}
function edgeForSize(size: string): Edge {
  return sizeHash(size) % 2 === 0 ? 'top' : 'bottom';
}
function sideForSize(size: string): Side {
  return sizeHash(size) % 2 === 0 ? 'right' : 'left';
}

// A label that names the real-world placement, shown in the "Advertisement" caption.
function placementLabel(orientation: Orientation, edge: Edge, side: Side, az: boolean): string {
  if (orientation === 'horizontal') {
    if (az) return edge === 'top' ? 'Üst banner' : 'Alt banner';
    return edge === 'top' ? 'Top leaderboard' : 'Bottom leaderboard';
  }
  const sideAz = side === 'right' ? 'sağ' : 'sol';
  const sideEn = side === 'right' ? 'right' : 'left';
  if (orientation === 'vertical') {
    return az ? `Yan panel (${sideAz})` : `Skyscraper (${sideEn})`;
  }
  return az ? `Yan blok (${sideAz})` : `Sidebar (${sideEn})`;
}

// The "Advertisement" wrapper a real site puts around a slot.
function AdFrame({ children, az }: { children: ReactNode; az: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[9px] uppercase tracking-[0.2em] text-[#121115]/30 mb-1.5 self-start">
        {az ? 'Reklam' : 'Advertisement'}
      </span>
      {children}
    </div>
  );
}

// Decorative text/heading lines used to fake article body copy.
function TextLines({ rows }: { rows: number[] }) {
  return (
    <div className="space-y-1.5">
      {rows.map((w, i) => (
        <div key={i} className="h-2 rounded bg-[#121115]/[0.07]" style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

// A realistic news-site mock ("AntHive") that frames the live creative in the placement
// a real publisher would use for its proportions: horizontal strips run full-width at the
// top or bottom; vertical skyscrapers and rectangle MRECs sit in the side column, left or
// right. The creative is scaled (proportions preserved) to fit whichever slot it lands in.
function WebsiteMock({ banner, az }: { banner: Banner; az: boolean }) {
  const orientation = orientationForSize(banner.size);
  const edge = edgeForSize(banner.size);
  const side = sideForSize(banner.size);
  const label = placementLabel(orientation, edge, side, az);
  const nav = az
    ? ['Ana səhifə', 'Dünya', 'Texnologiya', 'İqtisadiyyat', 'İdman', 'Mədəniyyat']
    : ['Home', 'World', 'Tech', 'Business', 'Sport', 'Culture'];

  // The side column is ~200px wide; the full-width strips get the inner content width.
  const inColumn = orientation === 'vertical' || orientation === 'rectangle';
  const liveAd = (
    <AdFrame az={az}>
      {inColumn ? (
        <LiveCreative banner={banner} maxWidth={196} maxHeight={orientation === 'vertical' ? 560 : 320} />
      ) : (
        <LiveCreative banner={banner} maxWidth={620} maxHeight={260} />
      )}
    </AdFrame>
  );

  // The article body. The side ad rides alongside it in the aside; rendered in a function
  // so the aside can sit on the left or right of the main column.
  const article = (
    <div className="flex-grow min-w-0">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#856157]">
        {az ? 'Texnologiya' : 'Technology'}
      </span>
      <h2 className="mt-1.5 text-lg font-bold leading-snug brand-display">
        {az
          ? 'Süni intellekt 2026-cı ildə rəqəmsal reklamı necə dəyişir'
          : 'How AI is reshaping digital advertising in 2026'}
      </h2>
      <p className="mt-1 text-[10px] text-[#121115]/40">
        {az ? 'Aytac Məmmədova · 4 dəqiqə oxu' : 'Aytac Mammadova · 4 min read'}
      </p>
      <div className="mt-3 h-32 rounded-lg bg-gradient-to-br from-stone-200 to-stone-300" />
      <div className="mt-3">
        <TextLines rows={[100, 96, 88]} />
      </div>
      <div className="mt-3">
        <TextLines rows={[100, 92, 80, 60]} />
      </div>
    </div>
  );

  const aside = (
    <aside className="hidden sm:block w-[200px] shrink-0">
      {/* Vertical & rectangle creatives sit at the top of the side column. */}
      {inColumn && <div className="mb-4 flex flex-col items-center">{liveAd}</div>}
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#121115]/50">
        {az ? 'Ən çox oxunan' : 'Most read'}
      </span>
      <div className="mt-2 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-2">
            <div className="w-12 h-12 shrink-0 rounded bg-stone-200" />
            <div className="flex-grow pt-0.5">
              <TextLines rows={[100, 70]} />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );

  // Full-width horizontal strip (top or bottom), e.g. leaderboard / billboard / anchor.
  const strip = (
    <div className="flex flex-col items-center bg-stone-50 border-y border-[#121115]/10 py-3 px-3">
      {liveAd}
    </div>
  );

  return (
    <div className="w-full max-w-[680px] bg-white rounded-2xl border border-[#121115]/10 shadow-xl overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-stone-100 border-b border-[#121115]/10">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
          <span className="w-3 h-3 rounded-full bg-[#febc2e]"></span>
          <span className="w-3 h-3 rounded-full bg-[#28c840]"></span>
        </div>
        <div className="flex-grow flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#121115]/10 text-[11px] text-[#121115]/50">
          <Globe className="w-3 h-3 text-[#121115]/40" />
          <span className="truncate">https://www.anthive.az</span>
        </div>
      </div>

      {/* The mock site itself */}
      <div className="bg-white text-[#121115]">
        {/* Masthead + nav */}
        <header className="px-5 pt-4 pb-3 border-b border-[#121115]/10">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold tracking-tight brand-display">AntHive</span>
            <div className="flex items-center gap-2 text-[10px] text-[#121115]/40">
              <span>{az ? '17 İyun 2026' : '17 June 2026'}</span>
              <span className="w-5 h-5 rounded-full bg-[#121115]/[0.06] flex items-center justify-center">
                <Globe className="w-3 h-3 text-[#121115]/40" />
              </span>
            </div>
          </div>
          <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-[#121115]/70">
            {nav.map((item, i) => (
              <span key={item} className={i === 0 ? 'text-[#856157]' : 'hover:text-[#121115] cursor-default'}>
                {item}
              </span>
            ))}
          </nav>
        </header>

        {/* Horizontal strip at the TOP, right under the nav. */}
        {orientation === 'horizontal' && edge === 'top' && strip}

        {/* Body: main column + side column, side picked left or right by size. */}
        <div className="flex gap-5 p-5">
          {inColumn && side === 'left' ? (
            <>
              {aside}
              {article}
            </>
          ) : (
            <>
              {article}
              {aside}
            </>
          )}
        </div>

        {/* Horizontal strip at the BOTTOM, above the footer caption. */}
        {orientation === 'horizontal' && edge === 'bottom' && strip}
      </div>

      {/* Placement caption so it's clear where the creative would run */}
      <div className="px-5 py-2.5 bg-stone-50 border-t border-[#121115]/10 text-[10px] text-[#121115]/45">
        {az ? 'Yerləşmə' : 'Placement'}: <span className="font-semibold text-[#121115]/70">{label}</span> · {banner.size}
      </div>
    </div>
  );
}

// A label for the mobile placement (single-column, so no left/right — only top/bottom
// anchors for strips, in-feed for everything else).
function mobilePlacementLabel(orientation: Orientation, edge: Edge, az: boolean): string {
  if (orientation === 'horizontal') {
    if (az) return edge === 'top' ? 'Üst lövbər' : 'Alt lövbər';
    return edge === 'top' ? 'Top anchor' : 'Bottom anchor';
  }
  return az ? 'Lent içi' : 'In-feed';
}

// The same realistic "AntHive" site, rendered as a single-column MOBILE page inside the
// phone shell. Mobile has no side rails, so: horizontal strips anchor to the top or
// bottom of the screen; verticals & rectangles run in-feed between article blocks. The
// creative scales (proportions preserved) to the narrow phone width.
function MobileMock({ banner, az }: { banner: Banner; az: boolean }) {
  const orientation = orientationForSize(banner.size);
  const edge = edgeForSize(banner.size);
  const label = mobilePlacementLabel(orientation, edge, az);
  // Usable width inside the phone feed (≈226px); leave a little breathing room.
  const FEED_W = 214;
  const isStrip = orientation === 'horizontal';

  const liveAd = (
    <AdFrame az={az}>
      <LiveCreative
        banner={banner}
        maxWidth={FEED_W}
        maxHeight={orientation === 'vertical' ? 380 : isStrip ? 120 : 260}
      />
    </AdFrame>
  );

  const strip = (
    <div className="flex flex-col items-center bg-white border-y border-[#121115]/10 py-2 px-2">
      {liveAd}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-white text-[#121115] text-left">
      {/* Top anchor strip sits above the masthead. */}
      {isStrip && edge === 'top' && strip}

      {/* Mobile masthead with hamburger */}
      <header className="flex items-center justify-between px-3 py-2.5 border-b border-[#121115]/10 shrink-0">
        <span className="text-base font-bold tracking-tight brand-display">AntHive</span>
        <div className="flex items-center gap-2">
          <span className="text-[8px] uppercase tracking-[0.15em] text-[#121115]/35">{label}</span>
          <div className="flex flex-col gap-[3px]">
            <span className="w-4 h-0.5 bg-[#121115]/60 rounded-full" />
            <span className="w-4 h-0.5 bg-[#121115]/60 rounded-full" />
            <span className="w-4 h-0.5 bg-[#121115]/60 rounded-full" />
          </div>
        </div>
      </header>

      {/* Scrolling article feed */}
      <div className="flex-grow overflow-y-auto px-3 py-3">
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#856157]">
          {az ? 'Texnologiya' : 'Technology'}
        </span>
        <h2 className="mt-1 text-sm font-bold leading-snug brand-display">
          {az
            ? 'Süni intellekt 2026-cı ildə rəqəmsal reklamı necə dəyişir'
            : 'How AI is reshaping digital advertising in 2026'}
        </h2>
        <p className="mt-1 text-[9px] text-[#121115]/40">
          {az ? 'Aytac Məmmədova · 4 dəqiqə oxu' : 'Aytac Mammadova · 4 min read'}
        </p>
        <div className="mt-2.5 h-24 rounded-lg bg-gradient-to-br from-stone-200 to-stone-300" />
        <div className="mt-2.5">
          <TextLines rows={[100, 96, 88]} />
        </div>

        {/* In-feed ad (vertical skyscraper or rectangle) between paragraphs. */}
        {!isStrip && <div className="my-3 flex flex-col items-center">{liveAd}</div>}

        <div className="mt-2.5">
          <TextLines rows={[100, 92, 80, 60, 70]} />
        </div>
      </div>

      {/* Bottom anchor strip sticks to the bottom of the screen. */}
      {isStrip && edge === 'bottom' && strip}
    </div>
  );
}

export default function PreviewModal({ banner, device, onDeviceChange, onClose, lang, t }: PreviewModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Esc closes; move focus into the modal on open, restore it to the trigger on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121115]/90 backdrop-blur-xl overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2.5rem] shadow-2xl max-w-3xl w-full overflow-hidden border border-[#121115]/10 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={banner.title}
      >

        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-[#121115]/10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#856157] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {t.interactiveLive}
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight brand-display text-[#121115]">{banner.size}</h3>
            <p className="text-xs text-[#121115]/55 mt-0.5">{banner.ratioLabel} · {banner.size}</p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label={t.close}
            className="shrink-0 w-9 h-9 rounded-full bg-[#121115]/5 hover:bg-[#121115]/10 flex items-center justify-center transition-colors text-[#121115] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#856157]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas */}
        <div className="bg-[#f0ede1] p-6 sm:p-8 overflow-y-auto">

          {/* Frame switcher */}
          <div className="flex items-center justify-end mb-6">
            <div className="flex flex-wrap justify-end gap-1 bg-white/80 p-1 rounded-full border border-[#121115]/10 text-xs">
              <button
                onClick={() => onDeviceChange('mobile')} aria-label={t.mockupPhone}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${device === 'mobile' ? 'bg-[#121115] text-white' : 'text-[#121115]/60 hover:text-[#121115]'}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.mockupPhone}</span>
              </button>
              <button
                onClick={() => onDeviceChange('website')} aria-label={lang === 'az' ? 'Veb sayt' : 'Website'}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${device === 'website' ? 'bg-[#121115] text-white' : 'text-[#121115]/60 hover:text-[#121115]'}`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'az' ? 'Veb sayt' : 'Website'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center py-4">
            {device === 'mobile' ? (
              /* Phone mockup: the realistic "AntHive" site rendered as a single-column
                 mobile page. Horizontal strips anchor to the top/bottom of the screen;
                 verticals & rectangles run in-feed — all scaled to the phone width. */
              <div className="relative mx-auto w-[290px] h-[550px] bg-[#121115] rounded-[3rem] p-3 shadow-2xl border-4 border-stone-800 flex flex-col">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-stone-800 rounded-b-2xl z-20 flex items-center justify-center">
                  <div className="w-10 h-1 bg-black rounded-full mb-1"></div>
                </div>
                {/* The phone screen: clips the mock site to the rounded viewport. */}
                <div className="flex-grow rounded-[2rem] overflow-hidden bg-white relative">
                  {/* Status bar */}
                  <div className="flex justify-between items-center text-[10px] text-[#121115]/50 px-4 pt-2 pb-1 bg-white">
                    <span className="font-semibold">9:41</span>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#121115]/40"></span>
                      <span className="w-3.5 h-2 bg-[#121115]/40 rounded-sm"></span>
                    </div>
                  </div>
                  <div className="h-[calc(100%-1.5rem)]">
                    <MobileMock banner={banner} az={lang === 'az'} />
                  </div>
                </div>
                <div className="w-20 h-1 bg-white/20 rounded-full mx-auto mt-2 mb-0.5"></div>
              </div>
            ) : (
              /* Website mockup: a realistic "AntHive" news site. The live banner drops
                 into the placement a real publisher would use for its proportions
                 (top/bottom strip, or left/right side column). */
              <WebsiteMock banner={banner} az={lang === 'az'} />
            )}
          </div>
        </div>

        {/* Details footer */}
        <div className="p-6 border-t border-[#121115]/10">
          <p className="text-sm text-[#121115]/70 leading-relaxed">{banner.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#121115]/70">
            <span className="px-3 py-1 rounded-full bg-[#121115]/5">{banner.category}</span>
            <span className="px-3 py-1 rounded-full bg-[#121115]/5">{banner.format}</span>
            <span className="px-3 py-1 rounded-full bg-[#121115]/5">{banner.size}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
