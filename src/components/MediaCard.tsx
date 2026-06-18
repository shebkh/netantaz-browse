import { useRef } from 'react';
import { Play } from 'lucide-react';
import type { MediaItem } from '../data/media';

// A banner-style (dark) card for a static image or video, used in the Gallery grid
// alongside BannerCard. The media sits in the dark frame at its natural aspect (object-
// contain — proportions preserved). Hover lifts the card + zooms the media; videos auto-
// play muted on hover. No filename/naming is shown.
export default function MediaCard({ item, isVideo }: { item: MediaItem; isVideo: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = encodeURI(item.src);

  const onEnter = () => {
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.play().catch(() => {});
    }
  };
  const onLeave = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group bg-[#121115] rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 border border-white/5"
    >
      <div className="relative bg-black flex items-center justify-center overflow-hidden min-h-[260px]">
        {isVideo ? (
          <>
            <video
              ref={videoRef}
              src={src}
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full max-h-[420px] object-contain transition-transform duration-500 group-hover:scale-[1.04]"
            />
            {/* Play hint, hidden on hover (when it starts playing). */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <Play className="w-6 h-6 text-[#121115] ml-0.5" fill="currentColor" />
              </div>
            </div>
          </>
        ) : (
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full max-h-[420px] object-contain transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
      </div>
    </div>
  );
}
