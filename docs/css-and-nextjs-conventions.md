# CSS & Next.js Conventions

## CSS

- **Never add new styles to `src/styles/globals.css`.** It is legacy and will eventually be split into multiple files.
- Every new page or component gets its own **CSS Module** (`ComponentName.module.css`) placed next to its `.tsx` file.
- Share design tokens (colors, fonts) through a tokens class and `composes`, not by repeating values. See `src/components/incine/theme.module.css` and how `Deck.module.css` / `IncineLayout.module.css` compose it.
- Watch out for `globals.css` resets that still apply everywhere (`* { margin: 0; padding: 0 }`, `ul { list-style: none }`, `a { color: inherit }`). If a module needs a default back, re-enable it explicitly (see `.tight` in `Deck.module.css` re-enabling list markers).

## Next.js patterns (Pages Router)

- Prefer **native Next.js solutions** over embedding raw HTML or iframes; content should be React components.
- Section-specific layouts use the official **per-page layout** pattern: a page declares `getLayout`, and `_app.tsx` applies it. Pages without `getLayout` get the default site `Layout` (header + footer) automatically.
- Load heavy or per-route components with **`next/dynamic`** so each route only downloads what it renders.
- Load fonts with **`next/font`** (self-hosted, no external `<link>` tags) and expose them as CSS variables. See `src/components/incine/fonts.ts`.
- Pages that need route params on the very first server render (no client-side flash) can force SSR with an empty `getServerSideProps`. See `src/pages/incine/[curso]/[clase].tsx`.
- Unlisted pages (reachable only by direct link) must set `<meta name="robots" content="noindex, nofollow" />` and must never be linked from the site.

## Reference implementation

The `/incine` section applies all of the above:

- `src/components/incine/` — components, CSS Modules, tokens, fonts
- `src/data/incine.ts` — data registry with `next/dynamic` imports
- `src/presentations/` — content as React components
- `src/pages/incine/` — redirect route + dynamic route with `getLayout`
