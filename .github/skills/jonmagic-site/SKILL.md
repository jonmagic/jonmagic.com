---
name: jonmagic-site
description: Quick reference for jonmagic.com site conventions, structure, and patterns. Use when working with files in the jonmagic.com repository—provides directory structure, Eleventy config, templates, CSS patterns, and build commands.
---

# jonmagic.com Site Reference

Quick reference for the jonmagic.com static site built with Eleventy.

## Build Commands

```bash
npm run build   # Generate static site to _site/
npm run start   # Build and serve locally
npm ci          # Install dependencies
```

## Directory Structure

```
src/
├── posts/           # Blog posts (*.md)
├── projects/        # Project pages (*.md)
├── about/           # About page
├── images/
│   ├── avatars/     # Site avatars (*.webp)
│   └── posts/       # Post-specific images
├── css/
│   └── base.css     # Main stylesheet
├── js/
│   └── site.js      # Client-side JavaScript
├── _includes/       # Nunjucks templates
├── _data/           # Data files (JSON)
└── _build/          # Build scripts

_site/               # Generated output (gitignored)
```

## Template Hierarchy

- `_includes/layout.njk` — Base layout (homepage vs page variants)
- `_includes/head.njk` — Meta tags, CSS, scripts
- `_includes/site-nav.njk` — Navigation
- `_includes/footer.njk` — Footer with auto-updating year
- `_includes/post-cta.njk` — Call-to-action for posts (2010+)

## Collections

Defined in `.eleventy.js`:

- **posts**: `src/posts/*.md` — All blog posts
- **projects**: `src/projects/*.md` — All project pages

## Special Features

### Semantic Search
- Vectors generated at build time in `src/_data/vectors.json`
- Copied to `_site/vectors.json` for client-side search

### Post Crop Data
- Random contribution graph crops per post
- Generated from title/date hash for consistency
- Stored in `src/_data/postCropData.json`

### Avatar Shuffling
- Avatars in `src/images/avatars/` (webp format)
- `avatars.json` generated at build time
- Client-side JS shuffles display

## CSS Conventions

From `src/css/base.css`:

- **Colors**: CSS custom properties (e.g., `--text-color`, `--bg-color`)
- **Responsive**: Mobile-first with `@media (min-width: ...)` breakpoints
- **Typography**: System fonts, comfortable line-height
- **Classes**: Kebab-case naming (`.site-header`, `.post-date`)

## Image Conventions

- **Format**: Prefer `.webp` for all images
- **Avatars**: Square, placed in `src/images/avatars/`
- **Post images**: `src/images/posts/{post-slug}/`
- **Markdown**: `![alt](/images/posts/{slug}/image.webp)`

## Eleventy Configuration

Key settings in `.eleventy.js`:

- **Input**: `src/`
- **Output**: `_site/`
- **Markdown**: markdown-it with emoji, GitHub alerts, anchor links
- **Syntax highlighting**: @11ty/eleventy-plugin-syntaxhighlight
- **RSS**: @11ty/eleventy-plugin-rss
- **Passthrough**: css, images, js, favicon

## Post-Build Actions

Automatically created in `_site/`:
- `.nojekyll` — Disables Jekyll processing on GitHub Pages
- `CNAME` — Custom domain (jonmagic.com)
- `vectors.json` — Semantic search index
- `avatars.json` — Avatar list

## GitHub Pages Deployment

- Push to `main` triggers GitHub Actions
- Builds and deploys `_site/` to `gh-pages` branch
- Uses `peaceiris/actions-gh-pages` action
