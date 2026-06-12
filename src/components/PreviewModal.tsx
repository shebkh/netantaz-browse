import { useEffect, useRef } from 'react';
import { X, Monitor, Smartphone } from 'lucide-react';
import type { Banner, Lang, TranslationStrings } from '../types';

type PreviewModalProps = {
  banner: Banner;
  device: 'desktop' | 'mobile';
  onDeviceChange: (device: 'desktop' | 'mobile') => void;
  onClose: () => void;
  lang: Lang;
  t: TranslationStrings;
};

export default function PreviewModal({ banner, device, onDeviceChange, onClose, lang, t }: PreviewModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
            <h3 className="mt-2 text-2xl font-bold tracking-tight brand-display text-[#121115]">{banner.title}</h3>
            <p className="text-xs text-[#121115]/55 mt-0.5">{banner.ratioLabel} · {banner.size}</p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label={t.close}
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
                  <div
                    className="shadow-xl"
                    style={{
                      width: `${banner.size.split('x')[0]}px`,
                      height: `${banner.size.split('x')[1]}px`,
                      maxWidth: '100%', maxHeight: '340px',
                      backgroundColor: banner.primaryColor,
                      color: banner.textColor,
                      borderRadius: '16px', display: 'flex', flexDirection: 'column',
                      justifyContent: 'space-between', padding: '16px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <div className="flex items-center justify-between text-[9px] uppercase tracking-wider opacity-85">
                      <span>{banner.category}</span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        {banner.format}
                      </span>
                    </div>
                    <div className="my-auto py-2">
                      <h4 className={`text-xs sm:text-sm font-bold tracking-tight leading-snug brand-display ${reduceMotion ? '' : 'animate-ad-pulse'}`}>
                        {lang === 'az' ? banner.headline : banner.headlineEn}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="px-3 py-1.5 rounded-full text-[9px] font-bold tracking-wide uppercase inline-block"
                        style={{ backgroundColor: banner.textColor, color: banner.primaryColor }}>
                        {lang === 'az' ? banner.cta : banner.ctaEn}
                      </span>
                      <span className="text-[9px] opacity-65 font-mono">{banner.size}</span>
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
                    width: `${banner.size.split('x')[0]}px`,
                    height: `${banner.size.split('x')[1]}px`,
                    maxWidth: '100%',
                    backgroundColor: banner.primaryColor,
                    color: banner.textColor,
                    borderRadius: '20px', display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between', padding: '24px',
                    boxShadow: '0 25px 50px -12px rgba(18, 17, 21, 0.25)'
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider opacity-85">
                    <span>{banner.category}</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                      {banner.format}
                    </span>
                  </div>
                  <div className="my-auto py-4">
                    <h4 className={`text-base sm:text-lg font-bold tracking-tight leading-snug brand-display ${reduceMotion ? '' : 'animate-ad-pulse'}`}>
                      {lang === 'az' ? banner.headline : banner.headlineEn}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase inline-block"
                      style={{ backgroundColor: banner.textColor, color: banner.primaryColor }}>
                      {lang === 'az' ? banner.cta : banner.ctaEn}
                    </span>
                    <span className="text-[10px] opacity-65 font-mono">{banner.size}</span>
                  </div>
                </div>
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
