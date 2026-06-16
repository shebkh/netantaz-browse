import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { X, Monitor, Smartphone, Globe, Apple } from 'lucide-react';
import type { Banner, Lang, TranslationStrings } from '../types';
import BannerPreview from './BannerPreview';

// The preview frames the modal can switch between. Exported so the parent's
// device state stays in sync with this component.
export type PreviewDevice = 'desktop' | 'mobile' | 'website' | 'ios';

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
function LiveCreative({ banner, maxHeight }: { banner: Banner; maxHeight: number }) {
  const [w, h] = banner.size.split('x');
  const box: CSSProperties = {
    width: `${w}px`,
    height: `${h}px`,
    maxWidth: '100%',
    maxHeight: `${maxHeight}px`,
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    display: 'block',
  };
  if (banner.preview.kind === 'image') {
    return <img src={banner.preview.src} alt={banner.title} loading="lazy" style={{ ...box, objectFit: 'contain' }} />;
  }
  return (
    <iframe
      src={banner.preview.src}
      title={banner.title}
      loading="lazy"
      scrolling="no"
      sandbox="allow-scripts"
      style={{ ...box, border: '0' }}
    />
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
        <div className="bg-[#b4b3ac] p-6 sm:p-8 overflow-y-auto">

          {/* Frame switcher */}
          <div className="flex items-center justify-end mb-6">
            <div className="flex flex-wrap justify-end gap-1 bg-white/80 p-1 rounded-full border border-[#121115]/10 text-xs">
              <button
                onClick={() => onDeviceChange('desktop')} aria-label={t.mockupDesktop}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${device === 'desktop' ? 'bg-[#121115] text-white' : 'text-[#121115]/60 hover:text-[#121115]'}`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.mockupDesktop}</span>
              </button>
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
              <button
                onClick={() => onDeviceChange('ios')} aria-label="iOS"
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${device === 'ios' ? 'bg-[#121115] text-white' : 'text-[#121115]/60 hover:text-[#121115]'}`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">iOS</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center py-4">
            {device === 'mobile' ? (
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
                  <BannerPreview banner={banner} maxHeight={340} />
                </div>
                <div className="w-20 h-1 bg-white/20 rounded-full mx-auto mb-1"></div>
              </div>
            ) : device === 'website' ? (
              /* Website mockup: browser window (title bar + address bar) with the
                 live banner placed in a plausible ad slot in sample page content. */
              <div className="w-full max-w-[640px] bg-white rounded-2xl border border-[#121115]/10 shadow-xl overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-3 px-4 py-2.5 bg-stone-100 border-b border-[#121115]/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#febc2e]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#28c840]"></span>
                  </div>
                  <div className="flex-grow flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#121115]/10 text-[11px] text-[#121115]/50">
                    <Globe className="w-3 h-3 text-[#121115]/40" />
                    <span className="truncate">https://www.netant.az</span>
                  </div>
                </div>
                {/* Sample page content with the ad slot */}
                <div className="p-5 bg-white">
                  <div className="h-4 w-1/2 rounded bg-[#121115]/10 mb-2"></div>
                  <div className="h-2.5 w-full rounded bg-[#121115]/[0.06] mb-1.5"></div>
                  <div className="h-2.5 w-11/12 rounded bg-[#121115]/[0.06] mb-1.5"></div>
                  <div className="h-2.5 w-3/4 rounded bg-[#121115]/[0.06] mb-4"></div>
                  {/* Ad slot */}
                  <div className="my-4 flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-widest text-[#121115]/30 mb-1.5">
                      {lang === 'az' ? 'Reklam' : 'Advertisement'}
                    </span>
                    <LiveCreative banner={banner} maxHeight={400} />
                  </div>
                  <div className="h-2.5 w-full rounded bg-[#121115]/[0.06] mb-1.5"></div>
                  <div className="h-2.5 w-5/6 rounded bg-[#121115]/[0.06]"></div>
                </div>
              </div>
            ) : device === 'ios' ? (
              /* iOS mockup: iPhone-style bezel with the live banner shown in-page. */
              <div className="relative mx-auto w-[300px] h-[600px] bg-[#121115] rounded-[3.2rem] p-3 shadow-2xl border-4 border-stone-800 flex flex-col">
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#121115] rounded-b-3xl z-20"></div>
                {/* Screen */}
                <div className="flex-grow rounded-[2.4rem] bg-white overflow-hidden flex flex-col">
                  {/* iOS status bar */}
                  <div className="flex justify-between items-center text-[10px] font-semibold text-[#121115] px-6 pt-3 pb-1">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <span className="w-3.5 h-2 rounded-sm bg-[#121115]/70"></span>
                      <span className="w-2 h-2 rounded-full bg-[#121115]/70"></span>
                    </div>
                  </div>
                  {/* In-app page content with the ad */}
                  <div className="flex-grow overflow-y-auto px-4 py-3 flex flex-col items-center">
                    <div className="w-full h-3.5 rounded bg-[#121115]/10 mb-2"></div>
                    <div className="w-11/12 h-2.5 rounded bg-[#121115]/[0.06] mb-1.5 self-start"></div>
                    <div className="w-3/4 h-2.5 rounded bg-[#121115]/[0.06] mb-4 self-start"></div>
                    <span className="text-[9px] uppercase tracking-widest text-[#121115]/30 mb-1.5">
                      {lang === 'az' ? 'Reklam' : 'Advertisement'}
                    </span>
                    <LiveCreative banner={banner} maxHeight={360} />
                    <div className="w-full h-2.5 rounded bg-[#121115]/[0.06] mt-4 mb-1.5"></div>
                    <div className="w-5/6 h-2.5 rounded bg-[#121115]/[0.06] self-start"></div>
                  </div>
                </div>
                {/* Home indicator */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-[#121115]/80 rounded-full"></div>
              </div>
            ) : (
              /* Desktop frame */
              <div className="bg-white/60 p-8 sm:p-12 rounded-[2rem] border border-[#121115]/5 shadow-sm max-w-full flex items-center justify-center">
                <BannerPreview banner={banner} maxHeight={460} />
              </div>
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
