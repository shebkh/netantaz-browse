import type { CSSProperties } from 'react';
import type { Banner } from '../types';

// Renders a banner's real creative at (close to) its native size: a static image,
// or the HTML5 demo in a sandboxed iframe. Falls back to a titled placeholder.
export default function BannerPreview({ banner, maxHeight = 260 }: { banner: Banner; maxHeight?: number }) {
  const [w, h] = banner.size.split('x');
  const box: CSSProperties = {
    width: `${w}px`,
    height: `${h}px`,
    maxWidth: '100%',
    maxHeight: `${maxHeight}px`,
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(255,255,255,0.12)',
  };

  if (banner.preview.kind === 'image') {
    return (
      <img
        src={banner.preview.src}
        alt={banner.title}
        loading="lazy"
        style={{ ...box, objectFit: 'cover', display: 'block' }}
      />
    );
  }

  // HTML5 demo. pointer-events disabled so a click in the grid opens the modal
  // instead of interacting with the iframe; the modal renders it interactive.
  return (
    <iframe
      src={banner.preview.src}
      title={banner.title}
      loading="lazy"
      scrolling="no"
      sandbox="allow-scripts allow-same-origin"
      style={{ ...box, border: '0', pointerEvents: 'none' }}
    />
  );
}
