# CSS & Next.js Conventions

## CSS

- **Never add new styles to `src/styles/globals.css`.** It is legacy and will eventually be split into multiple files.
- Every new page or component gets its own **CSS Module** (`ComponentName.module.css`) placed next to its `.tsx` file.
- Share design tokens (colors, fonts) through a tokens class and `composes`, not by repeating values. See `src/components/learn/theme.module.css` and how `Deck.module.css` / `LearnLayout.module.css` compose it.
- Watch out for `globals.css` resets that still apply everywhere (`* { margin: 0; padding: 0 }`, `ul { list-style: none }`, `a { color: inherit }`). If a module needs a default back, re-enable it explicitly (see `.tight` in `Deck.module.css` re-enabling list markers).

## Next.js patterns (Pages Router)

- Prefer **native Next.js solutions** over embedding raw HTML or iframes; content should be React components.
- Section-specific layouts use the official **per-page layout** pattern: a page declares `getLayout`, and `_app.tsx` applies it. Pages without `getLayout` get the default site `Layout` (header + footer) automatically.
- Load heavy or per-route components with **`next/dynamic`** so each route only downloads what it renders.
- Load fonts with **`next/font`** (self-hosted, no external `<link>` tags) and expose them as CSS variables. See `src/components/learn/fonts.ts`.
- Pages that need route params on the very first server render (no client-side flash) can force SSR with an empty `getServerSideProps`. See `src/pages/learn/[curso]/[clase].tsx`.
- Unlisted pages (reachable only by direct link) must set `<meta name="robots" content="noindex, nofollow" />` and must never be linked from the site.

## Languages (i18n)

- Locales are `en` (default, no URL prefix) and `es` (`/es/...`), configured in `next.config.js` and mirrored in `src/i18n/locales.ts`. `next/link` and `router.push` add the prefix by themselves; only server-side redirects (`getServerSideProps`, `next.config.js`) build it by hand with `localizedPath`.
- Browser-language detection only runs on `/`; a deep link without prefix opens in English on purpose. The language switch writes the `NEXT_LOCALE` cookie so `/` remembers the choice.
- User-facing text goes through dictionaries read with `useT` (`src/i18n/useT.ts`): type the `en` object first and derive `es` from its keys so the compiler demands every translation. Never branch on `router.locale` inside JSX.
- The plan and the decisions behind this are in `docs/i18n-handoff.md`.

## Reference implementation

The `/learn` section applies all of the above:

- `src/components/learn/` — components, CSS Modules, tokens, fonts
- `src/data/learn.ts` — data registry with `next/dynamic` imports
- `src/presentations/` — content as React components
- `src/pages/learn/` — redirect route + dynamic route with `getLayout`
