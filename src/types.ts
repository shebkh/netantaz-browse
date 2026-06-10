// Shared types for the Creatives Gallery (PROJECT.md §6).

export type Lang = 'az' | 'en';

export type Banner = {
  id: string;
  title: string;
  category: string;
  format: string;
  size: string;
  ratioLabel: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  headline: string; // AZ
  headlineEn: string;
  cta: string; // AZ
  ctaEn: string;
  description: string;
  // §6 lists "fast" | "slow" | "none"; the prototype data also uses "normal"
  // (b1/b5/b8). Union widened to keep the prototype's banner data verbatim.
  animationSpeed: 'fast' | 'slow' | 'normal' | 'none';
  isSparkle: boolean;
};

// One language's copy. Both AZ and EN must provide every key (enforced by
// `Translations` below). i18n is a hand-kept dictionary — see PROJECT.md §8.
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
