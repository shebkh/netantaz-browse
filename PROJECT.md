# PROJECT.md — NetAnt Creatives Gallery

> Single source of truth for this build. The AI agent must read this file before
> doing anything, and obey the **Work Agreement** below. If this file and any other
> instruction disagree, **this file wins**. If this file is silent on something, the
> agent **asks** — it does not invent.

---

## 1. What we're building
A "Creatives Gallery" section for NetAnt (netant.az): a browsable catalog of banner ad
*types* (standard + rich-media), with a left sidebar for navigation **and** filtering,
and a center column that displays the banners. Clicking a banner opens a view-only
preview with a desktop/mobile device switcher. Bilingual AZ/EN.

There is already a working prototype, `ad_gallery_website.tsx`. **It is the source of
truth for design, palette, copy, banner data, and behavior.** This project refactors it
from one file into a clean, production project — without redesigning it.

## 2. Stack
- Vite + React 18 + TypeScript (strict)
- Tailwind CSS v3 — installed & configured (never the Play CDN in the final build)
- lucide-react for icons
- Fonts via `<link>` in `index.html`: Manrope (display) + Inter (body)
- No other UI libraries. No state libraries. No backend.

## 3. Design system
Tailwind `theme.extend.colors`:

| Token | Hex | Use |
|---|---|---|
| `base` | `#b4b3ac` | page background (greige) |
| `ink` | `#121115` | text / primary actions |
| `clay` | `#856157` | accent |
| `sage` | `#5d6964` | accent |
| `ochre` | `#a69b85` | accent |
| `lavender` | `#77698a` | accent |

`theme.extend.fontFamily`: `display: ["Manrope", "sans-serif"]`, `body: ["Inter", "sans-serif"]`.
A `.brand-display` utility applies Manrope. Body text is Inter.
(Colors were sampled from screenshots and are slightly approximate — see Known Limitations.)

## 4. Target file structure
```
public/
  netant-logo.png
  demos/                         # live HTML5 creatives (future slice)
src/
  main.tsx
  App.tsx                        # renders <CreativesGallery/>
  index.css                      # @tailwind + keyframes/utilities
  types.ts                       # Banner, Lang
  data/
    banners.ts                   # INITIAL_BANNERS: Banner[]
    translations.ts              # az/en dictionary
  components/
    CreativesGallery.tsx         # shell: sidebar + main, owns ALL state
    Sidebar.tsx                  # logo + AZ/EN + nav + filters + contact
    GalleryGrid.tsx              # results header + grid + empty state
    BannerCard.tsx               # one card (favorite, hover overlay)
    PreviewModal.tsx             # view-only preview + device switcher
    StatsSection.tsx             # dark stats panel
    Toast.tsx                    # transient toast
index.html                       # font links
tailwind.config.js               # tokens
```

## 5. Scope
**In scope:** the gallery, sidebar nav+filters, AZ/EN, favorites (in-memory), preview
modal (view-only), stats/about view, responsive drawer, accessibility.

**Out of scope (do NOT build):** any ad editor/customizer, copy-code/export/share,
localStorage/sessionStorage persistence, auth, a CMS/backend, analytics, routing
libraries, or new design directions.

## 6. Data model
```ts
type Lang = "az" | "en";

type Banner = {
  id: string;
  title: string;
  category: string;        // e.g. "Fintech" | "Retail" | ...
  format: string;          // e.g. "HTML5 Animated" | "Rich Media" | ...
  size: string;            // "300x250"
  ratioLabel: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  headline: string;        // AZ
  headlineEn: string;
  cta: string;             // AZ
  ctaEn: string;
  description: string;
  animationSpeed: "fast" | "slow" | "none";
  isSparkle: boolean;
};
```
Exact field set comes from the prototype — copy it verbatim and type it.

---

## 7. Work Agreement
The agent agrees to all of the following for every slice:

1. **Read PROJECT.md first.** It is the source of truth. On any conflict, this file wins.
   If it's silent, ask — do not invent scope, design, or dependencies.
2. **One slice at a time.** Do only the *current* slice's scope. Do not start the next.
3. **No redesign.** Preserve the prototype's look, palette, copy, and behavior unless the
   slice explicitly says to change it.
4. **Touch only the files the slice lists.** If you believe another file must change,
   STOP and ask first.
5. **No new dependencies** beyond Section 2 without explicit approval.
6. **No destructive actions** — no deleting unrelated files, no rewriting files outside
   the slice, no `git` history changes — without confirmation.
7. **Meet the Definition of Done.** `npx tsc --noEmit` and `npm run build` must pass with
   zero errors before the slice is "done."
8. **Report on finish:** list files created/changed, a one-line summary each, how you
   verified, and any deviation from the spec. Then **stop at the slice boundary.**
9. **Keep diffs small and reviewable.** Prefer clarity over cleverness.

## 8. Known Limitations
The human and agent both acknowledge these up front:

- **Agent can't see the running UI.** "Looks correct" must be verified by the human in
  the browser; the agent only guarantees it compiles/builds.
- **Agent may hallucinate** file paths, props, or APIs. Small slices + this spec are the
  guardrails; review every diff.
- **Brand colors are approximate** — sampled from screenshots (the source site reads
  closer to `#87877F`; the prototype uses `#b4b3ac`). Treat as provisional until NetAnt
  confirms exact brand hex values.
- **Previews are placeholders.** Cards render mock banners; there are no real creative
  assets or live demos until the future slice that wires `public/demos/`.
- **No persistence by design.** Favorites and filters are in-memory and reset on reload.
  No localStorage/sessionStorage anywhere.
- **i18n is a hand-kept dictionary** (AZ/EN), not a framework. New copy means editing both
  language entries in `translations.ts`.
- **Fonts need the network.** Offline/blocked CDN falls back to system fonts.
- **No automated tests yet.** Optional future slice. Until then, QA is manual.
- **Accessibility needs a human pass** (keyboard, screen reader, contrast) beyond what the
  agent can self-check.

---

## 9. Slice roadmap
Vertical, independently-runnable slices. We move the prototype from one file into the
target structure (a "strangler" refactor) — the app runs after **every** slice.

| # | Slice | Outcome |
|---|---|---|
| 0 | Scaffold & baseline | Vite/React/TS/Tailwind/lucide set up; prototype runs as-is |
| 1 | Types & data | `types.ts`, `data/banners.ts`, `data/translations.ts` extracted |
| 2 | Shell & styles | `CreativesGallery.tsx` owns state; `Toast.tsx`; styles → `index.css` |
| 3 | Sidebar | `Sidebar.tsx` (nav + filters + lang + contact + mobile drawer) |
| 4 | Gallery | `GalleryGrid.tsx` + `BannerCard.tsx` |
| 5 | Preview | `PreviewModal.tsx` (view-only, device switch, Esc, focus, reduced-motion) |
| 6 | Stats & polish | `StatsSection.tsx`; real logo wired; a11y/QA pass |
| 7 | Demos (future) | Real thumbnails + `public/demos/<id>` via sandboxed iframe; (optional) tests |

---

## 10. Slice specs

### Slice 0 — Scaffold & baseline
**Goal:** a running app that shows the prototype unchanged.
**Files:** project scaffold, `index.html`, `tailwind.config.js`, `src/main.tsx`,
`src/index.css`, `src/App.tsx` (the prototype), `public/netant-logo.png`.
**Steps:**
1. `npm create vite@latest . -- --template react-ts` (only if no project exists).
2. `npm i lucide-react` ; `npm i -D tailwindcss postcss autoprefixer` ; `npx tailwindcss init -p`.
3. Tailwind `content`: `["./index.html","./src/**/*.{ts,tsx}"]`; add tokens + fonts from §3.
4. `src/index.css`: the three `@tailwind` directives (keep the prototype's inline `<style>`
   for now — it moves out in Slice 2).
5. Add the Manrope+Inter `<link>` to `index.html` `<head>`.
6. Place `ad_gallery_website.tsx` as `src/App.tsx` (default export stays `App`); ensure
   `main.tsx` renders `<App/>`. Put the logo in `public/`.
**Done when:** `npm run dev` shows the gallery with zero console/TS errors; fonts load;
`npm run build` passes.

### Slice 1 — Types & data
**Goal:** data and types live in their own files; UI unchanged.
**Files:** `src/types.ts`, `src/data/banners.ts`, `src/data/translations.ts`, `src/App.tsx` (imports).
**Done when:** `INITIAL_BANNERS` is typed `Banner[]`, translations typed, `App.tsx` imports
them, UI is pixel-identical, `tsc --noEmit` clean.

### Slice 2 — Shell & styles
**Goal:** state lives in a shell component; styles leave the JSX.
**Files:** `src/components/CreativesGallery.tsx`, `src/components/Toast.tsx`,
`src/index.css`, `src/App.tsx`.
**Steps:** move all `useState`/`useMemo` and the layout shell into `CreativesGallery`;
`App` just renders it. Move the prototype `<style>` block (keyframes: `animate-ad-pulse`,
`animate-ad-float`; utilities: `gradient-text`, `premium-grain`, `no-scrollbar`,
`.brand-display`) into `index.css`. Extract the toast into `Toast.tsx`.
**Done when:** behavior identical; no inline `<style>` left; build clean.

### Slice 3 — Sidebar
**Goal:** sidebar is its own component.
**Files:** `src/components/Sidebar.tsx`, `CreativesGallery.tsx`.
**Scope:** logo, AZ/EN toggle, nav (Gallery / Favorites+count / About), filters
(search, Format, Size, Category, clear-all — visible only on Gallery view), contact button;
sticky rail ≥1024px, off-canvas drawer + hamburger + backdrop below 1024px. Typed props.
**Done when:** all nav/filter interactions and the mobile drawer work; build clean.

### Slice 4 — Gallery
**Goal:** grid and card are components.
**Files:** `src/components/GalleryGrid.tsx`, `src/components/BannerCard.tsx`, `CreativesGallery.tsx`.
**Scope:** results header, responsive grid, empty state; card renders the mini live banner,
category/format chips, size badge, favorite heart, hover "Interactive View" overlay. Typed props.
**Done when:** grid + favorite + hover + empty state work; build clean.

### Slice 5 — Preview
**Goal:** the modal is a component and fully accessible.
**Files:** `src/components/PreviewModal.tsx`, `CreativesGallery.tsx`.
**Scope:** view-only (NO editing); desktop/mobile mockups using the banner's own
content; close on X / backdrop / Esc; restore focus to the triggering card; respect
`prefers-reduced-motion`. Typed props.
**Done when:** open/close, device switch, Esc, and focus restore all work; build clean.

### Slice 6 — Stats & polish
**Goal:** finish the split and polish.
**Files:** `src/components/StatsSection.tsx`, `CreativesGallery.tsx`, plus the header logo.
**Scope:** extract the About/stats panel; replace the text wordmark with
`public/netant-logo.png`; pass over focus styles, aria-labels, and reduced-motion.
**Done when:** About view works; logo renders; a11y self-checks pass; build clean.

### Slice 7 — Demos (future)
**Goal:** real previews. Replace card placeholders with `public/assets/thumbs/<id>.jpg`;
in the modal, load `public/demos/<id>/index.html` in a sandboxed iframe
(`sandbox="allow-scripts"`) when present, else keep the empty state. (Optional) add
Vitest + React Testing Library smoke tests.

---

## 11. Global Definition of Done (every slice)
- `npx tsc --noEmit` → 0 errors. `npm run build` → success.
- No console errors in `npm run dev`.
- Scope limited to the slice's file list; no out-of-scope features.
- Brand colors/copy unchanged from the prototype.
- Finish report delivered; agent stopped at the slice boundary.
