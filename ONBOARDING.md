# Onboarding — NetAnt Creatives Gallery (continue from here)

A browsable gallery of banner-ad creatives for NetAnt (netant.az): left sidebar (AZ/EN,
Gallery/Statik/Video/Favorites + **Formatlar** nav, search + Format/Size filters with an
always-visible reset, mobile drawer) and a grid of banner cards; clicking a card opens a
view-only preview modal that frames the LIVE creative inside a realistic **"AntHive"** mock
site — a **Mobil** phone mock and a **Desktop** mock, switchable. **Gallery shows everything**
(banners + static images + videos). **Statik/Video** render real assets as Instagram-style
posts. **Formatlar** is a SmartBee-style ad-format catalog (flyout menu → full-page mock demo
per format). Bilingual AZ/EN. Built by refactoring a single-file prototype
(`ad_gallery_website.tsx`) into a clean Vite project, slice by slice, then ingesting real
sample creatives, then reworking the preview to look like a real publisher page.

## Status (current)
- **All slice + feature work (0–7, FT-1→FT-4) DONE; preview rework, Formatlar showcase, and
  Instagram Statik/Video sections DONE.** Latest commit `c4b7a79` on `main`. (Update this
  hash as new work lands.)
- Gallery = **53 real banners** (17 static images + 36 interactive HTML5) **plus** 12 static
  images + 4 videos shown as cards. Statik = those 12 images; Video = those 4 .mp4s.
- `npx tsc --noEmit` = 0 errors; `npm run build` succeeds.
- Repo: https://github.com/shebkh/netantaz-browse (PRIVATE). `gh` is authenticated as `shebkh`.

## Most recent work — Formatlar showcase + Instagram media sections (latest, `c4b7a79`)
A large user-directed session (all verified via headless Chrome screenshots, `tsc`+`build` clean):
- **Preview modal:** device toggle "Website"→**Desktop** (Monitor icon), phone→**Mobil**; switcher
  moved into the header; translucent backdrop; fit-to-panel (canvas scrolls, not page); mobile
  mock pre-scrolls to the in-feed ad.
- **Formatlar** (`FormatShowcase.tsx`): new sidebar section under Favorites. Clicking it opens a
  **matte-blur flyout PORTALED to `document.body`** (so it overlays page content — a sidebar
  stacking-context trap otherwise hid it) listing ad formats from smartbee.az **minus** those
  already in the gallery (and "Olimpus"/"Display Banner"/"Sola Sürüşdür" per user). Each format
  renders a **full-width AntHive desktop mock** demoing that format's real placement + a size
  badge: Inpage/Pre-roll video (auto-hide / skip→player), Catfish & Extended-catfish (Samsung-
  style carousel) footers, Background 160×600 skyscrapers, Pop-up & Fullscreen (live countdown
  → "site opens") overlays, Collapsible, Xəbər bloku, Expandable (hover-grow), Interscroller
  (**scroll-position-linked** parallax), E-commerce (red product grid), Click-to-Fullscreen,
  Sticky vertical corner, Floating (flag-wave, no close, persists). Brand text = **NetAnt**.
- **Gallery shows everything:** banners + static + videos as banner-style `MediaCard`s, appended
  only when no filters are active (media has no format/size to filter on).
- **Statik/Video** (`media.ts`, `InstagramPost.tsx`): read real files from `public/static` (12
  images) and `public/video` (4 .mp4s), framed as **Instagram posts** (IG chrome, natural aspect
  = no letterbox, no captions, hover lift+zoom). Videos **autoplay muted on hover** with a
  bottom-right **mute/unmute** toggle. Statik = full-width 3-col masonry; **Video = centered
  pairs** (`max-w-6xl` 2-col). Both **auto-scroll to the grid** (past the hero) on open.
- **Filters:** reset button always visible (disabled when inactive); clicking **Gallery** resets
  filters and returns to the grid.
- **Tooling:** `vite.config.ts` now sets `server.watch.ignored: ['**/Statik/**','**/video/**']`
  — the dev server was crashing with `EBUSY` when Vite's watcher hit Windows-locked `.png`s in
  those root folders. Those redundant root dumps are also **`.gitignore`d** (~170MB); the app
  serves the `public/` copies. Originals left on disk, untouched.

## Earlier — Preview rework + creative-visibility fixes
The preview modal was overhauled and a batch of "banners not showing / wrong size" bugs fixed.
- **Mock site renamed BeeTimes → AntHive** (`anthive.az`).
- **Device switch is now Mobile + Website only** — the standalone/desktop ("Müstəqil Görünüş")
  view was removed (dropped from `PreviewDevice`, the switcher, and `BannerPreview`'s only modal
  user). Default device = `mobile`.
- **Realistic mocks with size-based ad placement** (in `PreviewModal.tsx`): an `orientationForSize`
  helper routes each creative — horizontal strips → top/bottom leaderboard; vertical skyscrapers
  & rectangle MRECs → side column (Website) or in-feed (Mobile). Top/bottom & left/right are
  picked deterministically from a size hash (no `Math.random` in the chosen spot).
- **Creatives scale to fit, proportions preserved:** images fill a correctly-proportioned box
  (`objectFit:contain`); iframes use `transform:scale` (they render at fixed px). The earlier
  transform-on-`<img>` approach pinned the JPG top-left and showed the rest of the box as a grey
  placeholder — fixed.
- **Interactive creatives are engageable in the modal:** iframe `sandbox="allow-scripts
  allow-same-origin"` (loads first-party assets) with **no** `pointer-events:none`. Grid cards
  keep `pointer-events:none` so a click opens the modal.
- **Grey-box fixes:** static `<img>` is eager (`loading` removed) + `decoding="async"`, and
  `will-change` was dropped from `.card-reveal` — layer promotion left images that decode after
  rasterization painted blank in Chromium.
- **`product` demo fixed:** its `index.html` was a bare fragment (no `<head>` → CSS/JS never
  loaded); wrapped it in a real HTML doc, fixed a `layer.png`→`Layer.png` case mismatch, and
  corrected its size `300x250`→`728x90` in `banners.ts` (its CSS is 728×90).

### Earlier feature batch (FT-1 → FT-4) — all DONE
Showcase ordering (animated demos sort first); Sidebar Format merge ("Weather *" → one chip,
display-only) + glassmorphism rail; Preview website + phone mockups (now the AntHive rework
above); Static section (groups image banners) + intentionally-EMPTY Video section (empty-state
+ AZ/EN keys). All additive — nothing was deleted. Decisions: merge applies to **Format** only;
Video ships empty; glass is a subtle matte panel on the flat greige bg by design.

## Stack & layout
- Vite + React 18 + TypeScript (strict) + Tailwind v3 + lucide-react.
- Components: `App` → `CreativesGallery` (**owns ALL state**) → `Sidebar`, `GalleryGrid`
  (→ `BannerCard` → `BannerPreview`), `PreviewModal`, `Toast`.
  - `BannerPreview` (grid, non-interactive) and `PreviewModal`'s own `LiveCreative`
    (modal, interactive) share the scale-to-fit rendering pattern but differ in pointer
    events + sandbox. `PreviewModal` also holds the `WebsiteMock` / `MobileMock` AntHive
    chrome and the `orientationForSize` placement helpers.
- Data: `src/data/banners.ts` (`INITIAL_BANNERS`, auto-generated from the kits),
  `src/data/translations.ts`. Types: `src/types.ts` (`Banner` is preview-based:
  `preview: {kind:'image'|'demo'; src}`). Styles: `src/index.css`.
- Real creatives live in `public/creatives/meta/<size>.jpg` (static) and
  `public/demos/<id>/index.html` (HTML5, shown in a sandboxed iframe). ~62 MB, committed.

## How to run (Windows / PowerShell)
Node LTS 24 + gh were installed via winget. **Terminals opened before that lack them on PATH** —
prepend this in each PowerShell command (or restart VS Code once to fix permanently):
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')
```
Then: `npm install` (already done) · `npm run dev` → http://localhost:5173/ · `npm run build`.
The dev server occasionally gets killed by the environment — just rerun `npm run dev`.

## How we work (please keep doing this)
- `PROJECT.md` §7 / `LOCKED_PROMPT.md` are the contract: one task at a time, touch only the
  task's files, no redesign beyond what a task states, no new deps, **delete nothing**, **ask if
  underspecified — don't invent**, and the Definition of Done is `tsc --noEmit` 0 errors +
  `npm run build` success + no dev console errors.
- The FT-1…FT-4 locked-prompt batch (with STOP gates between tasks) is complete; recent work
  has been small, user-directed changes verified one at a time. Keep confirming before
  large/irreversible moves.
- Commit after each accepted change (this repo commits feature work directly to `main`); push
  when the user asks.
- Big component/data moves done with throwaway Node scripts (not retyping) to keep the
  Azerbaijani text byte-exact — keep that habit.

## Gotchas
- **`PROJECT.md` churn:** the environment duplicates PROJECT.md and renormalizes line endings
  (CRLF). Edit it via a Node read-modify-write script and verify, not line-based editors.
- **Commit messages with Azerbaijani chars:** the PowerShell here-string mangles `'` + non-ASCII.
  Write the message to a temp file and `git commit -F <file>` instead.
- **Re-ingesting kits:** strip any nested `.git` dirs before `git add`.
- Interactive-creative **sizes are best-effort** (`ad.size` meta / folder name / default 300x250).
- **Demo `index.html` may be a bare fragment** (no `<head>`/CSS/JS links) — renders blank in the
  iframe. `product` was the one such case (now fixed); check this first if a demo shows grey.
- **Lazy + scroll-reveal = grey boxes:** `loading="lazy"` images inside the `opacity-0`
  `.card-reveal` cards may never paint; static `<img>` is eager + `decoding="async"`, and
  `.card-reveal` must NOT use `will-change` (it leaves late-decoding images blank in Chromium).
- **Headless verify:** `chrome.exe --headless=new --virtual-time-budget=N --screenshot=...`
  (Chrome at `C:\Program Files\Google\Chrome\Application\chrome.exe`) renders the running dev
  server cache-free — invaluable for "it shows for me but not the user" (usually a stale browser
  cache; hard-refresh Ctrl+Shift+R).
- **FT-2 glass caveat:** flat greige page bg means `backdrop-blur` is subtle by design.
- **Ordering:** sort a copy in render/memo; never mutate `INITIAL_BANNERS`.

## Open follow-ups
1. **Push the 2 local commits** (`a3e01a4`, `725916f`) to `origin/main`.
2. ~~Eyeball flagged creatives~~ — RESOLVED. `pixel-page`, `scratch-to-reveal`, `shake-break`,
   `nar` verified acceptable and KEPT. (`product` was separately broken and is now fixed.)
3. ~~Wire `netant-logo.png`~~ — N/A. The on-screen text wordmark was removed per request; no logo
   asset exists in the repo. (If a logo is later provided, add it under `public/` and wire the sidebar.)
4. Optional: prune dead i18n keys (`navAbout`/`navContact`/`trustedBy`/`statsDesc`/`statsTitle`,
   and now `mockupDesktop` after the desktop view was removed); add Vitest/RTL smoke tests
   (new dev deps — needs approval).

## Read next
- `LOCKED_PROMPT.md` — the single per-task execution prompt with STOP gates.
- `PROGRESS-LOG.md` — detailed per-slice history, decisions, env facts, caveats.
- `PROJECT.md` — source of truth for stack/tokens/scope/slice specs.
