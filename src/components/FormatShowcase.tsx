import { useState, useEffect, useRef } from 'react';
import { Globe, X, Play, Pause, Maximize2, Volume2, ChevronRight } from 'lucide-react';

// Renders a SmartBee-style ad FORMAT demonstrated inside the AntHive desktop browser
// mock (the same chrome as the preview modal's WebsiteMock). Each format shows a
// branded placeholder creative placed/animated the way that format behaves on a real
// publisher page — top/bottom strips, side wallpaper, overlays, in-feed, sticky, etc.
// No external assets: the creatives are CSS/JS placeholders built here.

type FormatShowcaseProps = {
  format: string; // the display name picked from the Formatlar flyout
  az: boolean;
};

// A reusable branded "ad" tile — the generic creative we drop into each placement.
// `size` prints a SmartBee-style IAB size badge (e.g. "300×250") on the creative.
function AdTile({
  label,
  size,
  w,
  h,
  className = '',
  shimmer = false,
}: {
  label?: string;
  size?: string;
  w?: number | string;
  h?: number | string;
  className?: string;
  shimmer?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-[#856157] via-[#77698a] to-[#5d6964] text-white flex flex-col items-center justify-center text-center shadow-md ${className}`}
      style={{ width: w, height: h }}
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-80">NetAnt</span>
      {label && <span className="mt-1 px-2 text-[11px] font-semibold leading-tight">{label}</span>}
      {size && (
        <span className="absolute top-1.5 right-1.5 text-[8px] font-bold tracking-wider bg-black/30 px-1.5 py-0.5 rounded">
          {size}
        </span>
      )}
      {shimmer && <span className="pointer-events-none absolute inset-0 fmt-shimmer" />}
    </div>
  );
}

// The "Advertisement" caption a publisher puts above a slot.
function AdCaption({ az }: { az: boolean }) {
  return (
    <span className="text-[9px] uppercase tracking-[0.2em] text-[#121115]/30 mb-1.5 self-start">
      {az ? 'Reklam' : 'Advertisement'}
    </span>
  );
}

// Fake article body copy.
function TextLines({ rows }: { rows: number[] }) {
  return (
    <div className="space-y-1.5">
      {rows.map((wd, i) => (
        <div key={i} className="h-2 rounded bg-[#121115]/[0.07]" style={{ width: `${wd}%` }} />
      ))}
    </div>
  );
}

export default function FormatShowcase({ format, az }: FormatShowcaseProps) {
  // Overlay-style formats (Pop-up / Fullscreen / Click-to-Fullscreen) open over the page.
  // They reset whenever the selected format changes.
  const [overlayOpen, setOverlayOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(false); // Expandable hover / Click-to-Fullscreen
  const [countdown, setCountdown] = useState(7); // Fullscreen "site opens in Ns" timer
  const [inpageVisible, setInpageVisible] = useState(true); // Inpage auto-hides after 10s
  const [prerollEnded, setPrerollEnded] = useState(false); // Pre-roll ad → video player
  useEffect(() => {
    setOverlayOpen(true);
    setCollapsed(false);
    setExpanded(false);
    setCountdown(7);
    setInpageVisible(true);
    setPrerollEnded(false);
  }, [format]);

  // Fullscreen takeover: tick the countdown; when it hits 0 the "site opens" (overlay closes).
  useEffect(() => {
    if (format !== 'Fullscreen' || !overlayOpen) return;
    if (countdown <= 0) {
      setOverlayOpen(false);
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [format, overlayOpen, countdown]);

  // Inpage video disappears after 10s (it's an in-content insert).
  useEffect(() => {
    if (format !== 'Inpage') return;
    const id = setTimeout(() => setInpageVisible(false), 10000);
    return () => clearTimeout(id);
  }, [format]);

  // Pre-roll: after a few seconds the ad ends and the real video player appears.
  useEffect(() => {
    if (format !== 'Pre-roll') return;
    const id = setTimeout(() => setPrerollEnded(true), 4000);
    return () => clearTimeout(id);
  }, [format]);

  // Inpage: scroll the page so the ad is in view when it appears.
  const inpageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (format !== 'Inpage') return;
    const id = setTimeout(() => {
      inpageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
    return () => clearTimeout(id);
  }, [format]);

  // Interscroller: a true parallax tied to the PAGE scroll position — the inner creative
  // shifts as the window scrolls past the fixed frame.
  const interRef = useRef<HTMLDivElement>(null);
  const interInnerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (format !== 'Interscroller') return;
    const frame = interRef.current;
    const inner = interInnerRef.current;
    if (!frame || !inner) return;
    const onScroll = () => {
      const rect = frame.getBoundingClientRect();
      // 0 when the frame's top reaches the viewport bottom, 1 when its bottom reaches the top.
      const progress = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      // Travel = how much taller the creative is than its frame.
      const travel = inner.offsetHeight - frame.clientHeight;
      inner.style.transform = `translateY(${-clamped * travel}px)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [format]);

  const nav = az
    ? ['Ana səhifə', 'Dünya', 'Texnologiya', 'İqtisadiyyat', 'İdman', 'Mədəniyyat']
    : ['Home', 'World', 'Tech', 'Business', 'Sport', 'Culture'];

  // The "Background" format paints wallpaper in the page gutters behind the site.
  const isBackground = format === 'Background';

  // Which formats run a full-width strip at the top of the page.
  const topStrip = format === 'Collapsible';
  // Bottom-anchored sticky formats.
  const isCatfish = format === 'Catfish';
  const isExtendedCatfish = format === 'Extended catfish';
  // Corner-anchored.
  const isStickyCorner = format === 'Sticky vertical corner';
  const isFloating = format === 'Floating';
  // Overlays.
  const isPopup = format === 'Pop-up';
  const isFullscreen = format === 'Fullscreen';
  const isClickFs = format === 'Click To Fullscreen';
  // In-article formats.
  const isInpage = format === 'Inpage';
  const isPreroll = format === 'Pre-roll';
  const isInterscroller = format === 'Interscroller';
  const isExpandable = format === 'Expandable';
  const isEcommerce = format === 'E-commerce';
  const isNewsBlock = format === 'Xəbər bloku';

  return (
    <div
      className={`relative w-full rounded-2xl border border-[#121115]/10 shadow-xl overflow-hidden ${isBackground ? 'bg-gradient-to-br from-[#856157] to-[#77698a]' : 'bg-white'}`}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-stone-100 border-b border-[#121115]/10">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-grow flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#121115]/10 text-[11px] text-[#121115]/50">
          <Globe className="w-3 h-3 text-[#121115]/40" />
          <span className="truncate">https://www.anthive.az</span>
        </div>
      </div>

      {/* The viewport: relative so sticky/overlay/corner formats anchor inside the mock.
          Tall (~full-width browser page) so the mock fills its allotted area. */}
      <div className="relative min-h-[820px]">
        {/* Background takeover: 160×600 skyscrapers flush against the page on both sides
            (no gap — they connect to the centered site mock). */}
        {isBackground && (
          <>
            <div className="absolute top-6 left-0 hidden sm:block">
              <AdTile size="160×600" w={90} h={338} className="rounded-none" />
            </div>
            <div className="absolute top-6 right-0 hidden sm:block">
              <AdTile size="160×600" w={90} h={338} className="rounded-none" />
            </div>
          </>
        )}

        {/* The page sits on white; for Background it's centered so the skyscrapers butt
            right up against its left/right edges. */}
        <div className={`bg-white text-[#121115] ${isBackground ? 'mx-[90px] my-0 shadow-2xl' : ''}`}>
          {/* Collapsible top strip */}
          {topStrip && (
            <div className="bg-stone-50 border-b border-[#121115]/10 px-3 py-2 flex flex-col items-center">
              <AdCaption az={az} />
              <div className="w-full flex items-center justify-center transition-all duration-500" style={{ height: collapsed ? 64 : 200 }}>
                <AdTile size={collapsed ? '970×90' : '970×250'} label={collapsed ? (az ? 'Genişləndir' : 'Expand') : (az ? 'Açıla bilən banner' : 'Collapsible banner')} w="100%" h="100%" />
              </div>
              <button
                onClick={() => setCollapsed((c) => !c)}
                className="mt-1 text-[10px] font-semibold text-[#856157] hover:underline"
              >
                {collapsed ? (az ? 'Aç ▾' : 'Open ▾') : (az ? 'Bağla ▴' : 'Collapse ▴')}
              </button>
            </div>
          )}

          {/* Masthead + nav */}
          <header className="px-5 pt-4 pb-3 border-b border-[#121115]/10">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold tracking-tight brand-display">AntHive</span>
              <div className="flex items-center gap-2 text-[10px] text-[#121115]/40">
                <span>{az ? '18 İyun 2026' : '18 June 2026'}</span>
                <span className="w-5 h-5 rounded-full bg-[#121115]/[0.06] flex items-center justify-center">
                  <Globe className="w-3 h-3 text-[#121115]/40" />
                </span>
              </div>
            </div>
            <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-[#121115]/70">
              {nav.map((item, i) => (
                <span key={item} className={i === 0 ? 'text-[#856157]' : ''}>{item}</span>
              ))}
            </nav>
          </header>

          {/* Pre-roll: directly UNDER the header. First a small demo ad with a skip button
              (bottom-right); after a few seconds it becomes a black video screen with
              player controls, implying real video follows the ad. */}
          {isPreroll && (
            <div className="px-5 pt-4 border-b border-[#121115]/10 pb-4">
              <AdCaption az={az} />
              <div className="relative mx-auto max-w-[520px] rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
                {!prerollEnded ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#856157] via-[#77698a] to-[#5d6964]" />
                    <div className="absolute inset-0 fmt-shimmer" />
                    {/* Mini animation: a pulsing brand mark + drifting accent. */}
                    <div className="relative z-10 text-center text-white">
                      <span className="inline-block text-base font-extrabold uppercase tracking-widest animate-ad-pulse">NetAnt</span>
                      <p className="text-[11px] opacity-90 mt-1">{az ? 'Reklam' : 'Advertisement'}</p>
                    </div>
                    <span className="absolute top-6 left-1/2 -translate-x-1/2 w-10 h-10 rounded-lg bg-white/20 fmt-flag" />
                    {/* Skip button — bottom-right corner. */}
                    <button className="absolute bottom-2 right-2 z-10 flex items-center gap-1 text-[11px] font-semibold text-white bg-black/55 hover:bg-black/75 px-2.5 py-1.5 rounded">
                      {az ? 'Reklamı keç' : 'Skip Ad'} <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    {/* The actual video (black screen) with playback controls. */}
                    <div className="relative z-10 w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent text-white">
                      <Pause className="w-4 h-4" />
                      <Volume2 className="w-4 h-4" />
                      <div className="flex-grow h-1 rounded-full bg-white/30"><div className="h-1 w-1/3 rounded-full bg-white" /></div>
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Body: article + sidebar */}
          <div className="flex gap-5 p-5">
            <div className="flex-grow min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#856157]">
                {az ? 'Texnologiya' : 'Technology'}
              </span>
              <h2 className="mt-1.5 text-lg font-bold leading-snug brand-display">
                {az ? 'Süni intellekt 2026-cı ildə rəqəmsal reklamı necə dəyişir' : 'How AI is reshaping digital advertising in 2026'}
              </h2>
              <p className="mt-1 text-[10px] text-[#121115]/40">
                {az ? 'Aytac Məmmədova · 4 dəqiqə oxu' : 'Aytac Mammadova · 4 min read'}
              </p>
              <div className="mt-3 h-48 rounded-lg bg-gradient-to-br from-stone-200 to-stone-300" />
              <div className="mt-4"><TextLines rows={[100, 96, 88, 94]} /></div>

              {/* ---- In-article format demos ---- */}
              {/* Inpage: a video insert BETWEEN paragraphs, centred, that auto-hides after
                  10s. The page auto-scrolls to it on open (see inpageRef effect). */}
              {isInpage && inpageVisible && (
                <div ref={inpageRef} className="my-5 mx-auto max-w-[560px]">
                  <AdCaption az={az} />
                  <div className="relative rounded-lg overflow-hidden bg-[#121115] aspect-video flex items-center justify-center fmt-pop-in">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#856157] via-[#77698a] to-[#5d6964]" />
                    <div className="absolute inset-0 fmt-shimmer" />
                    <div className="relative z-10 w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg animate-ad-pulse">
                      <Play className="w-6 h-6 text-[#121115] ml-0.5" fill="currentColor" />
                    </div>
                    <span className="absolute bottom-2 left-2 z-10 text-[9px] font-bold uppercase tracking-widest text-white/90 bg-black/40 px-1.5 py-0.5 rounded">
                      {az ? 'Səhifədaxili video' : 'Inpage video'}
                    </span>
                  </div>
                </div>
              )}

              {isInterscroller && (
                <div className="my-4">
                  <AdCaption az={az} />
                  {/* A fixed window (text-block width) through which a taller creative scrolls
                      in sync with the PAGE scroll — the true interscroller parallax. */}
                  <div ref={interRef} className="relative h-72 rounded-lg overflow-hidden border border-[#121115]/10 bg-[#121115]">
                    <div ref={interInnerRef} className="absolute inset-x-0 top-0 will-change-transform" style={{ height: '220%' }}>
                      <div className="h-1/3 bg-gradient-to-br from-[#856157] to-[#77698a] flex items-center justify-center">
                        <span className="text-white text-base font-extrabold uppercase tracking-widest">NetAnt</span>
                      </div>
                      <div className="h-1/3 bg-gradient-to-br from-[#77698a] to-[#5d6964] flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">{az ? 'Yeni kampaniya' : 'New campaign'}</span>
                      </div>
                      <div className="h-1/3 bg-gradient-to-br from-[#5d6964] to-[#856157] flex items-center justify-center">
                        <span className="text-white text-xs font-semibold bg-white/15 px-3 py-1 rounded-full">{az ? 'Ətraflı' : 'Learn more'}</span>
                      </div>
                    </div>
                    <span className="absolute top-2 right-2 z-10 text-[8px] font-bold tracking-wider text-white/90 bg-black/30 px-1.5 py-0.5 rounded">360×640</span>
                  </div>
                </div>
              )}

              {isExpandable && (
                <div className="my-4">
                  <AdCaption az={az} />
                  <div
                    onMouseEnter={() => setExpanded(true)}
                    onMouseLeave={() => setExpanded(false)}
                    className="transition-all duration-500 cursor-pointer"
                    style={{ height: expanded ? 300 : 90 }}
                  >
                    <AdTile size={expanded ? '728×300' : '728×90'} label={expanded ? (az ? 'Genişləndi!' : 'Expanded!') : (az ? 'Üzərinə gəlin' : 'Hover to expand')} w="100%" h="100%" />
                  </div>
                </div>
              )}

              <div className="mt-4"><TextLines rows={[100, 92, 80, 60, 88, 72]} /></div>
              <div className="mt-5 h-44 rounded-lg bg-gradient-to-br from-stone-200 to-stone-300" />
              <div className="mt-4"><TextLines rows={[100, 90, 96, 70, 84]} /></div>
              <h3 className="mt-6 text-base font-bold leading-snug brand-display">
                {az ? 'Reklam texnologiyalarının gələcəyi' : 'The future of ad technology'}
              </h3>
              <div className="mt-3"><TextLines rows={[100, 95, 88, 92, 76, 100, 64]} /></div>
              <div className="mt-5 h-40 rounded-lg bg-gradient-to-br from-stone-200 to-stone-300" />
              <div className="mt-4"><TextLines rows={[100, 90, 80]} /></div>

              {/* Xəbər bloku: a 728×90 text+thumbnail "short news" strip at the bottom of
                  the article (no size badge). */}
              {isNewsBlock && (
                <div className="mt-6">
                  <AdCaption az={az} />
                  <div className="rounded-lg border border-[#121115]/10 bg-white shadow-sm overflow-hidden flex" style={{ maxWidth: 728, height: 90 }}>
                    {[
                      { t: az ? 'ABŞ-da güclü zəlzələ qeydə alındı' : 'Strong earthquake recorded in the US' },
                      { t: az ? 'Yeni texnologiya bazarı dəyişir' : 'New tech is reshaping the market' },
                      { t: az ? 'İdman xəbərləri: həftənin xülasəsi' : 'Sports: the week in review' },
                    ].map((it, i) => (
                      <div key={i} className={`flex-1 min-w-0 flex items-center gap-2 p-2 ${i > 0 ? 'border-l border-[#121115]/10' : ''}`}>
                        <div className="w-12 h-12 shrink-0 rounded bg-gradient-to-br from-[#856157] to-[#77698a]" />
                        <div className="min-w-0">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-[#856157]">{az ? 'Xəbər' : 'News'}</span>
                          <p className="text-[10px] font-semibold leading-tight line-clamp-2">{it.t}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar (wide enough to host true 300×250 right-side ad formats). */}
            <aside className="hidden sm:block w-[300px] shrink-0">
              {/* Right-side ad formats live at the top of the sidebar. */}
              {isEcommerce && (
                <div className="mb-5">
                  <AdCaption az={az} />
                  {/* SmartBee e-commerce style: brand header + a product grid with dynamic
                      prices. 300×250, brand-coloured to match the other ads. */}
                  <div className="rounded-lg overflow-hidden shadow-md" style={{ width: 300, height: 250 }}>
                    <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-[#856157] to-[#77698a] text-white">
                      <span className="text-xs font-extrabold tracking-wide">NetAnt SHOP</span>
                      <span className="text-[9px] font-semibold uppercase tracking-widest opacity-90">{az ? 'Endirim' : 'Sale'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-px bg-[#121115]/5 h-[calc(100%-36px)]">
                      {[
                        { n: az ? 'Soyuducu' : 'Fridge', p: '₼1029' },
                        { n: az ? 'Paltaryuyan' : 'Washer', p: '₼239' },
                        { n: 'TV', p: '₼629' },
                        { n: az ? 'Soba' : 'Oven', p: '₼129' },
                      ].map((it) => (
                        <div key={it.n} className="bg-white p-2 flex flex-col items-center justify-center text-center">
                          <div className="w-full h-10 rounded bg-gradient-to-br from-stone-200 to-stone-300" />
                          <span className="mt-1 text-[9px] font-semibold text-[#121115]/70 truncate w-full">{it.n}</span>
                          <span className="text-[11px] font-extrabold text-[#856157]">{it.p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {isClickFs && (
                <div className="mb-5">
                  <AdCaption az={az} />
                  <button onClick={() => setExpanded(true)} className="block text-left">
                    <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-[#856157] via-[#77698a] to-[#5d6964] text-white shadow-md flex flex-col items-center justify-center text-center px-4" style={{ width: 300, height: 250 }}>
                      <span className="absolute top-2 right-2 text-[9px] font-bold tracking-wider bg-black/30 px-1.5 py-0.5 rounded">300×250</span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] opacity-80">NetAnt</span>
                      <span className="mt-2.5 text-2xl font-extrabold leading-tight brand-display">{az ? 'Tam ekran üçün klikləyin' : 'Click for fullscreen'}</span>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold bg-white/15 px-4 py-1.5 rounded-full"><Maximize2 className="w-4 h-4" /> {az ? 'Aç' : 'Open'}</span>
                    </div>
                  </button>
                </div>
              )}

              <span className="text-[10px] font-bold uppercase tracking-widest text-[#121115]/50">
                {az ? 'Ən çox oxunan' : 'Most read'}
              </span>
              <div className="mt-2 space-y-3">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-12 h-12 shrink-0 rounded bg-stone-200" />
                    <div className="flex-grow pt-0.5"><TextLines rows={[100, 70]} /></div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>

        {/* ---- Sticky / corner / floating formats anchored to the viewport ---- */}
        {/* Catfish: a 728×90 ad centered at the very bottom (no gap) with a close button. */}
        {isCatfish && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            <div className="relative">
              <button className="absolute -top-3 right-0 z-10 w-6 h-6 rounded-full bg-[#121115] text-white flex items-center justify-center shadow"><X className="w-3.5 h-3.5" /></button>
              <AdTile size="728×90" label={az ? 'Kampaniyanızı bizimlə böyüdün' : 'Grow your campaign with us'} w={728} h={90} className="rounded-t-lg rounded-b-none max-w-[92vw]" />
            </div>
          </div>
        )}

        {/* Extended catfish: a Samsung-style product carousel pinned to the bottom centre
            (no gap), scrolling horizontally, with an order CTA + close. */}
        {isExtendedCatfish && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            <div className="relative w-full max-w-[900px]">
              <button className="absolute -top-3 right-2 z-20 w-6 h-6 rounded-full bg-[#121115] text-white flex items-center justify-center shadow"><X className="w-3.5 h-3.5" /></button>
              <div className="flex items-stretch bg-[#1b1b1f] text-white rounded-t-lg overflow-hidden shadow-[0_-4px_20px_rgba(0,0,0,0.25)]" style={{ height: 120 }}>
                <div className="shrink-0 flex flex-col justify-center px-4 bg-black/30">
                  <span className="text-sm font-extrabold tracking-wide">NetAnt</span>
                  <span className="text-[9px] uppercase tracking-widest opacity-70">{az ? 'Məhsullar' : 'Products'}</span>
                </div>
                {/* Scrolling product strip (duplicated for a seamless loop). */}
                <div className="relative flex-grow overflow-hidden">
                  <div className="absolute inset-y-0 flex items-center gap-3 px-3 fmt-carousel">
                    {[...Array(2)].flatMap((_, dup) =>
                      [0, 1, 2, 3, 4].map((i) => (
                        <div key={`${dup}-${i}`} className="shrink-0 w-24 h-[88px] rounded-md bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-1">
                          <div className="w-14 h-10 rounded bg-gradient-to-br from-[#856157] to-[#77698a]" />
                          <span className="text-[10px] font-bold text-[#e2b15b]">₼{[1029, 239, 629, 129, 169][i]}</span>
                        </div>
                      )),
                    )}
                  </div>
                </div>
                <button className="shrink-0 flex items-center gap-1 px-4 bg-[#e23b3b] text-white text-xs font-bold">
                  {az ? 'Sifariş' : 'Order'} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sticky vertical corner: flush to the bottom-right (no gaps). */}
        {isStickyCorner && (
          <div className="absolute bottom-0 right-0 w-[200px]">
            <div className="relative">
              <button className="absolute top-1 right-1 z-10 w-6 h-6 rounded-full bg-[#121115] text-white flex items-center justify-center shadow"><X className="w-3.5 h-3.5" /></button>
              <AdTile size="300×600" label="NetAnt" w="100%" h={400} className="rounded-none" />
            </div>
          </div>
        )}

        {/* Floating: a fixed top-right banner that waves like a flag (no close, persists). */}
        {isFloating && (
          <div className="absolute top-28 right-10">
            <div className="fmt-flag rounded-xl overflow-hidden shadow-lg" style={{ width: 210, height: 174 }}>
              <div className="relative w-full h-full bg-gradient-to-br from-[#856157] via-[#77698a] to-[#5d6964] text-white flex flex-col items-center justify-center text-center px-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-80">NetAnt</span>
                <span className="mt-1.5 text-[13px] font-extrabold leading-tight brand-display">{az ? 'Kampaniyanızı kreativ bannerlərlə böyüdün' : 'Boost your campaign with creative banners'}</span>
                <span className="mt-2 w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center"><ChevronRight className="w-5 h-5" /></span>
              </div>
            </div>
          </div>
        )}

        {/* ---- Overlay formats ---- */}
        {isPopup && overlayOpen && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="relative fmt-pop-in">
              <button onClick={() => setOverlayOpen(false)} className="absolute -top-3 -right-3 z-10 w-7 h-7 rounded-full bg-white text-[#121115] flex items-center justify-center shadow-lg"><X className="w-4 h-4" /></button>
              <AdTile size="400×400" label={az ? 'Xüsusi təklif!' : 'Special offer!'} w={320} h={320} />
            </div>
          </div>
        )}

        {(isFullscreen || (isClickFs && expanded)) && overlayOpen && (
          <div className="absolute inset-0 bg-[#121115]/90 flex items-center justify-center fmt-pop-in">
            {/* Top-right control: a countdown caption + close (Fullscreen only). */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              {isFullscreen && (
                <span className="text-[11px] font-semibold text-white/85 bg-white/10 px-2.5 py-1 rounded-full">
                  {az ? `Saytın açılmasına ${countdown} saniyə qalıb` : `Site opens in ${countdown}s`}
                </span>
              )}
              <button onClick={() => { setOverlayOpen(false); setExpanded(false); }} className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <div className="text-center text-white">
              <Maximize2 className="w-8 h-8 mx-auto mb-3 opacity-80" />
              <p className="text-lg font-bold brand-display">NetAnt</p>
              <p className="text-sm opacity-80 mt-1">{az ? 'Tam ekran reklam təcrübəsi' : 'Fullscreen ad takeover'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
