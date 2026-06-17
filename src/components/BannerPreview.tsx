import type { CSSProperties } from 'react';
import type { Banner } from '../types';

// Renders a banner's real creative scaled to fit within maxWidth × maxHeight while
// preserving its exact aspect ratio (never upscaling past native size): a static image,
// or the HTML5 demo in a sandboxed iframe. The outer box is sized to the scaled footprint
// (declared aspect ratio), so the surrounding layout stays correct.
export default function BannerPreview({
  banner,
  maxWidth = 280,
  maxHeight = 260,
}: {
  banner: Banner;
  maxWidth?: number;
  maxHeight?: number;
}) {
  const [w, h] = banner.size.split('x').map(Number);
  const nativeW = w || 300;
  const nativeH = h || 250;
  const scale = Math.min(1, maxWidth / nativeW, maxHeight / nativeH);
  const boxW = nativeW * scale;
  const boxH = nativeH * scale;

  // Footprint after scaling — what occupies space in the card. The image/iframe fills it.
  const outer: CSSProperties = {
    width: `${boxW}px`,
    height: `${boxH}px`,
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(255,255,255,0.12)',
  };

  if (banner.preview.kind === 'image') {
    // The JPG simply fills the box; box ratio == declared ratio, so no distortion. Use
    // contain so any slight ratio mismatch letterboxes rather than crops the creative.
    return (
      <div style={outer}>
        {/* Eager (not lazy): these JPGs are small, and lazy-loading inside the opacity-0
            scroll-reveal cards left some images unpainted (the grey box). */}
        <img
          src={banner.preview.src}
          alt={banner.title}
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      </div>
    );
  }

  // An iframe renders its content at fixed px, so transform:scale is the only way to shrink
  // an HTML5 demo without distorting it. pointer-events disabled so a click in the grid
  // opens the modal instead of interacting; the modal renders it interactive. allow-same-
  // origin lets first-party demos load their own relative assets (else they render blank).
  return (
    <div style={outer}>
      <iframe
        src={banner.preview.src}
        title={banner.title}
        loading="lazy"
        scrolling="no"
        sandbox="allow-scripts allow-same-origin"
        style={{
          width: `${nativeW}px`,
          height: `${nativeH}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          border: '0',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
