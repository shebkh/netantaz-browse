// Real static + video creatives served from public/. Filenames can contain spaces and
// other characters, so src paths are URL-encoded at use sites (encodeURI). Titles are a
// lightly prettified version of the filename.

export type MediaItem = {
  src: string; // web path under public/ (raw; encode before use)
  title: string;
};

// Turn a filename into a readable title: drop extension, replace separators with spaces,
// collapse whitespace, and Title-Case.
function titleFromFile(file: string): string {
  const noExt = file.replace(/\.[^.]+$/, '');
  const cleaned = noExt.replace(/[_;]+/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

const STATIC_FILES = [
  '4.png',
  '5.png',
  '6.png',
  'V1.png',
  'V2.png',
  'smartcell.png',
  'Smartcell_ no_more_searching.png',
  '4;5_.jpg',
  'smartcell_1gb_giveawey2.png',
  'smartcell_bee.png',
  'smartcell_summer_campaign.png',
  'smartcell_turkey.png',
];

const VIDEO_FILES = [
  'dc_meksika-CAR.mp4',
  'iqos_1.mp4',
  'misli_VESTHEM-ARSENAL.mp4',
  'ucl_arsenal-atletiko.mp4',
];

export const STATIC_MEDIA: MediaItem[] = STATIC_FILES.map((f) => ({
  src: `/static/${f}`,
  title: titleFromFile(f),
}));

export const VIDEO_MEDIA: MediaItem[] = VIDEO_FILES.map((f) => ({
  src: `/video/${f}`,
  title: titleFromFile(f),
}));
