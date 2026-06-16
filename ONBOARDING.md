# Onboarding — NetAnt Creatives Gallery (continue from here)

A browsable gallery of banner-ad creatives for NetAnt (netant.az): left sidebar (logo,
AZ/EN, Gallery/Favorites nav, search + Format/Size filters, mobile drawer) and a grid of
banner cards; clicking a card opens a view-only preview modal with a desktop/mobile switch.
Bilingual AZ/EN. Built by refactoring a single-file prototype (`ad_gallery_website.tsx`)
into a clean Vite project, slice by slice, then ingesting real sample creatives.

## Status (current)
- **All slice work (0–7) is DONE, committed, and pushed.** Latest commit `d34d3cc` on `main`.
  (Update this hash as the FT tasks below land.)
- Gallery = **53 real banners**: 17 static images + 36 interactive HTML5 creatives.
- `npx tsc --noEmit` = 0 errors; `npm run build` succeeds.
- Repo: https://github.com/shebkh/netantaz-browse (PRIVATE). `gh` is authenticated as `shebkh`.

## Active work — Feature batch (FT-1 → FT-4), one task at a time
Driven by `LOCKED_PROMPT.md` (single prompt, hard STOP-and-report gates between tasks).
All four tasks are **additive/display/styling only — delete nothing**.

1. **FT-1 — Showcase ordering + size titles.** Animated banners (animationSpeed
   "fast"/"slow") sort ahead of non-animated; verify titles already display as sizes and
   only derive a display value if not (never overwrite `title`/`size`). Display-order only,
   never mutate `INITIAL_BANNERS`.
2. **FT-2 — Sidebar: Format merge + glassmorphism.** Collapse Format entries that share a
   base name after stripping the trailing size token ("weather 300x600" + "weather 300x250"
   → "weather"); display/predicate only, no `format` data edited — agent must list the
   distinct formats and proposed grouping before coding. Restyle the rail as a rounded
   matte-glass panel (brand tokens only; blur reads subtle on the flat greige bg — expected;
   page bg unchanged). Drawer/hamburger/backdrop must stay intact.
3. **FT-3 — Preview: website + iOS mockups.** Show the banner inside a browser-window mockup
   and an iPhone-bezel mockup, alongside the existing device switch. For `preview.kind:'demo'`
   render the LIVE creative via the existing sandboxed iframe (`sandbox="allow-scripts"`) —
   no static thumbnail, no rebuilding demos. Keep view-only + Esc/backdrop/X + focus restore
   + reduced-motion.
4. **FT-4 — Static + (empty) Video sections.** Static section groups image-based banners by
   display; Video section is intentionally EMPTY for now (empty-state + new AZ/EN keys in
   `translations.ts`). No video data model, fields, or assets. Reuse any existing grouping;
   if a change seems to require deleting/restructuring data, STOP and ask.

### Decisions locked for this batch
- Heading merge applies to the **Format** filter (not Size/Category).
- **Video section ships empty** for now — no assets provided yet.
- **Delete nothing** — sections are additive; the earlier "delete if exists" is off the table.
- Glass is a rounded translucent matte panel; dramatic frost isn't achievable without changing
  the flat greige page background, which is out of scope.

## Stack & layout
- Vite + React 18 + TypeScript (strict) + Tailwind v3 + lucide-react.
- Components: `App` → `CreativesGallery` (**owns ALL state**) → `Sidebar`, `GalleryGrid`
  (→ `BannerCard` → `BannerPreview`), `PreviewModal` (→ `BannerPreview`), `Toast`.
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
- The locked prompt has STOP gates between FT-1…FT-4: review + accept + reply "continue" before
  the agent starts the next task.
- Commit + push after each accepted task.
- Big component/data moves done with throwaway Node scripts (not retyping) to keep the
  Azerbaijani text byte-exact — keep that habit.

## Gotchas
- **`PROJECT.md` churn:** the environment duplicates PROJECT.md and renormalizes line endings
  (CRLF). Edit it via a Node read-modify-write script and verify, not line-based editors.
- **Re-ingesting kits:** strip any nested `.git` dirs before `git add`.
- Interactive-creative **sizes are best-effort** (`ad.size` meta / folder name / default 300x250).
- **FT-2 glass caveat:** flat greige page bg means `backdrop-blur` is subtle by design.
- **FT-1 ordering:** sort a copy in render/memo; never mutate `INITIAL_BANNERS`.

## Open follow-ups (after the FT batch)
1. **Eyeball the gallery** at localhost:5173 — confirm interactive previews/mockups look right.
   Four creatives are kept-but-flagged (minor missing asset): `pixel-page`, `scratch-to-reveal`,
   `shake-break`, `nar` — decide whether to drop any (human call; needs explicit ID list).
2. **`netant-logo.png`** is now provided — wire it into the sidebar in place of the text wordmark
   (check a dark logo doesn't disappear on the greige rail; a transparent-bg version may be needed).
3. Optional: prune dead i18n keys (`navAbout`/`navContact`/`trustedBy`/`statsDesc`/`statsTitle`);
   add Vitest/RTL smoke tests (new dev deps — needs approval).

## Read next
- `LOCKED_PROMPT.md` — the single per-task execution prompt with STOP gates.
- `PROGRESS-LOG.md` — detailed per-slice history, decisions, env facts, caveats.
- `PROJECT.md` — source of truth for stack/tokens/scope/slice specs.
