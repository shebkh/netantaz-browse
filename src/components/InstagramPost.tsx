import { useRef, useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Volume2, VolumeX } from 'lucide-react';
import type { MediaItem } from '../data/media';

// An Instagram-style post framing a real static image or video creative. The media area
// follows the asset's NATURAL aspect ratio (no letterbox, no crop). On hover the post
// lifts + the media zooms slightly; videos auto-play (muted) on hover and pause on leave.
// No filename caption is shown.
export default function InstagramPost({ item, isVideo }: { item: MediaItem; isVideo: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true); // muted by default
  const src = encodeURI(item.src);

  const onEnter = () => {
    const v = videoRef.current;
    if (v) {
      v.muted = muted;
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
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !muted;
    setMuted(next);
    if (videoRef.current) videoRef.current.muted = next;
  };

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group bg-white rounded-2xl overflow-hidden border border-[#121115]/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* IG header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#962fbf] p-[2px]">
          <div className="w-full h-full rounded-full bg-white p-[2px]">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#856157] to-[#77698a]" />
          </div>
        </div>
        <span className="text-[13px] font-semibold text-[#121115]">netant.az</span>
        <MoreHorizontal className="w-4 h-4 text-[#121115]/50 ml-auto" />
      </div>

      {/* Media — natural aspect, zooms slightly on hover. overflow-hidden clips the zoom. */}
      <div className="relative bg-black overflow-hidden">
        {isVideo ? (
          <video
            ref={videoRef}
            src={src}
            muted={muted}
            loop
            playsInline
            preload="metadata"
            className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        {/* Mute/unmute toggle — bottom-right of the media (like Instagram). Video only. */}
        {isVideo && (
          <button
            onClick={toggleMute}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="absolute bottom-2 right-2 z-10 w-8 h-8 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* IG action row */}
      <div className="px-3 pt-2.5 pb-3">
        <div className="flex items-center gap-4">
          <Heart className="w-5 h-5 text-[#121115] hover:text-red-500 transition-colors" />
          <MessageCircle className="w-5 h-5 text-[#121115]" />
          <Send className="w-5 h-5 text-[#121115]" />
          <Bookmark className="w-5 h-5 text-[#121115] ml-auto" />
        </div>
      </div>
    </div>
  );
}
