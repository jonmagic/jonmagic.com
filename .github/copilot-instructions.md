# Copilot Instructions for jonmagic.com

## Core Commands
- **Build:** `npm run build` (runs Eleventy to generate the static site)
- **Start/Serve:** `npm run start` (build and serve locally)
- **Deploy:** On push to `main`, GitHub Actions builds and deploys `_site/` to `gh-pages` branch using `peaceiris/actions-gh-pages`.
- **Dependencies:** Managed with npm; install with `npm ci`.
- **No explicit lint, test, docs, or migration scripts present.**

## High-Level Architecture
- **Static site** built with [Eleventy (11ty)](https://www.11ty.dev/).
- **Source:** All content and assets in `src/` (Markdown, Nunjucks templates, CSS, JS, images).
- **Build Output:** `_site/` (published to GitHub Pages).
- **Config:** `.eleventy.js` (sets passthrough copies, output dir, post-build steps for `.nojekyll` and `CNAME`).
- **No backend, database, or external API integrations detected.**

## Style Rules
- **Formatting:**
  - Use 2 spaces for JS, Nunjucks, and CSS.
  - Prefer single quotes in JS, double quotes in HTML/Nunjucks.
- **Imports:**
  - CommonJS (`require`) in Eleventy config.
- **Naming:**
  - Filenames and variables are descriptive and lowercase with dashes/underscores.
  - CSS classes use kebab-case.
- **Typing:**
  - No TypeScript; JS is untyped.
- **Error Handling:**
  - Minimal; only in Eleventy config for file writes.
- **HTML/CSS:**
  - Responsive design via media queries.
  - Use CSS variables for color and spacing.
  - Avatars and images use `.webp` format.

## Agent Rules
- No `.cursor`, `.cursorrules`, `AGENTS.md`, `AGENT.md`, `CLAUDE.md`, `.windsurfrules`, or prior Copilot instructions found.
- Follow only the rules in this file and those implied by project structure and code.

## Other Notes
- **Custom domain:** `CNAME` is set to `jonmagic.com`.
- **Analytics:** Plausible Analytics.
- **Avatars:** Managed in `src/images/avatars/` and displayed via Nunjucks includes and JS shuffling.
- **Footer:** Year auto-updates via JS.

Refer to this file for all future AI coding agent work in this repository.
