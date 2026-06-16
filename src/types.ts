// Shared types for the Creatives Gallery.

export type Lang = 'az' | 'en';

// How a banner is previewed: a static image, or an HTML5 demo loaded in an iframe.
export type BannerPreview =
  | { kind: 'image'; src: string }
  | { kind: 'demo'; src: string };

export type Banner = {
  id: string;
  title: string;
  category: string;
  format: string;
  size: string; // "300x250"
  ratioLabel: string;
  description: string;
  preview: BannerPreview;
};

// One language's copy. Both AZ and EN must provide every key (enforced by
// `Translations` below). i18n is a hand-kept dictionary.
export type TranslationStrings = {
  heroSub: string;
  heroTitlePart1: string;
  heroTitleHighlight: string;
  heroTitlePart2: string;
  heroDesc: string;
  btnMagic: string;
  btnJoin: string;
  navHome: string;
  navGallery: string;
  navAbout: string;
  navServices: string;
  navPortfolio: string;
  navSupport: string;
  navContact: string;
  searchPlaceholder: string;
  filterTitle: string;
  filterFormat: string;
  filterSize: string;
  filterCategory: string;
  all: string;
  favorites: string;
  navStatic: string;
  navVideo: string;
  videoEmptyTitle: string;
  videoEmptyDesc: string;
  staticEmptyTitle: string;
  staticEmptyDesc: string;
  statsTitle: string;
  statsDesc: string;
  viewDemo: string;
  customizeBtn: string;
  dimension: string;
  formatType: string;
  industry: string;
  noResults: string;
  clearFilters: string;
  editorTitle: string;
  editText: string;
  editCta: string;
  editBg: string;
  previewDevice: string;
  mockupPhone: string;
  mockupDesktop: string;
  applyChanges: string;
  copied: string;
  exportJson: string;
  close: string;
  featuredBadge: string;
  interactiveLive: string;
  trustedBy: string;
  footerText: string;
};

export type Translations = Record<Lang, TranslationStrings>;
