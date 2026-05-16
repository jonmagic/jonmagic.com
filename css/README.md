---
permalink: false
eleventyExcludeFromCollections: true
---

# CSS architecture

The site CSS is intentionally small and split by ownership. `index.css` is the only entrypoint loaded by templates and imports files in cascade order:

1. `reset.css`: local browser normalization, box sizing, and body defaults.
2. `tokens.css`: site-wide colors, fonts, spacing, radii, shadows, and measures.
3. `prose.css`: Markdown and raw element styles for headings, links, lists, code, tables, images, and alerts.
4. `layout.css`: site wrapper, navigation, page, footer, and tiny layout utilities.
5. `components.css`: cards, featured list, post CTA, social links, avatars, and typing effects.
6. `search.css`: semantic search page and search-result-specific styles.
7. `vendor-prism.css`: Prism syntax highlighting, kept separate because it is vendored/customized.

## Rules of thumb

- Keep class names kebab-case and prefer existing names when changing markup.
- Add broad styles to `prose.css` only when raw Markdown elements need them across pages.
- Add component styles to `components.css` only when the component owns a stable class.
- Keep `search.css` for search-specific selectors and JavaScript states such as `.search-status.loading`.
- Use `tokens.css` for shared design values. Internal token references should use `var(--token)` without literal fallbacks once the token is defined.
- Do not add CSS for a class just because it exists in a template. Classes should be styling hooks, JavaScript hooks, or documented extension points.

## Template and JavaScript contract

Audited homepage scaffolding classes with no CSS or JavaScript contract were removed: `home-layout`, `main-content`, `featured-posts`, `featured-item`, `featured-meta`, `featured-info`, `featured-title`, `featured-desc`, `view-all`, and `homepage-title`.

Kept hooks include:

- `featured-list`, because it owns list reset styling for the homepage featured posts list.
- `site-*`, `nav-*`, `content`, and `page`, because they own layout and navigation styling.
- `post-card-*`, `project-*`, `post-cta*`, `post-merch-*`, `social-links`, avatar classes, and typing classes, because they own component styling.
- Search IDs and classes such as `#semantic-search-input`, `.search-status`, `.search-help`, `.search-score`, and `post-card-*`, because `src/js/site.js` reads or generates them.

## Visual review process

For CSS changes, run `npm run build`, then capture the required routes, viewports, light/dark schemes, and the live search query `copilot sessions` with the existing screenshot harness under `ideas/`. Compare against the latest approved baseline or stage screenshots. Treat mobile nav, dark mode, post cards, search result cards, code blocks, and CTAs as high-risk surfaces.

## Adding a component

1. Give the component one stable owner class in the template.
2. Add its styles to the owning CSS file, usually `components.css`; use `layout.css` only for page-level structure.
3. Reuse existing tokens before adding new ones. If a new token is needed, define light and dark values together in `tokens.css`.
4. Avoid important declarations; adjust selector order or ownership instead.
5. Run the build and the visual review loop.

## Current audits

- Important declarations: none remain in `src/css`.
- Token fallbacks: no shared design-token fallbacks remain. The only intentional CSS custom property fallback is `var(--crop-x, 0%) var(--crop-y, 0%)` in `components.css`, because those are per-card instance properties supplied by templates or search JavaScript.
