# AGENTS.md for jonmagic.com

## Core commands

- Build: `npm run build`
- Serve locally: `npm run start`
- Install dependencies: `npm ci`

There are no explicit lint, test, docs, or migration scripts.

## Architecture

- Static site built with Eleventy.
- Source content and assets live under `src/`.
- Blog posts live in `src/posts/*.md`.
- Post images live in `src/images/posts/{post-slug}/`.
- Build output is `_site/`.
- GitHub Pages deploys `_site/` from pushes to `main`.

## Style conventions

- Use 2 spaces for JS, Nunjucks, CSS, and generated HTML snippets.
- Prefer single quotes in JS.
- Prefer double quotes in HTML/Nunjucks.
- Use CommonJS (`require`) in Eleventy config.
- Use lowercase kebab-case filenames and CSS classes.
- Prefer `.webp` images.

## Blog post conventions

- New posts go in `src/posts/{post-slug}.md`.
- Use simple date frontmatter for new posts.
- Every post needs the `post` tag.
- Post images go in `src/images/posts/{post-slug}/`.
- Markdown image paths should be `/images/posts/{post-slug}/{image}.webp`.
- Run `npm run build` after post, image, data, CSS, template, or redirect changes.

## Social redirect conventions

When a post will be shared on social platforms, create short first-party redirect pages instead of putting long UTM URLs in social copy.

Use these paths when the channel is relevant:

- LinkedIn: `src/li/{short-slug}.njk` -> `/li/{short-slug}/`
- Bluesky: `src/bsky/{short-slug}.njk` -> `/bsky/{short-slug}/`
- X: `src/x/{short-slug}.njk` -> `/x/{short-slug}/`

Redirect pages should:

- set `layout: false` and `eleventyExcludeFromCollections: true`,
- use `meta name="robots" content="noindex, follow"`,
- set `link rel="canonical"` to the real post URL,
- include useful OG/Twitter title, description, and image metadata,
- redirect with meta refresh, JS, and a normal fallback link,
- use relative redirect targets so local testing stays on `localhost`,
- include only `utm_source=<channel>` and `utm_medium=social` unless there is a concrete reason to add more.

Example target:

```text
/posts/my-post/?utm_source=linkedin&utm_medium=social
```

Do not auto-post to social platforms. Draft copy and links, then wait for explicit human approval.

## Featured posts

The homepage shows up to 4 featured posts, sorted by numeric `featured`.

Publishing a post includes revisiting the homepage featured posts.

1. Query Plausible top pages for `jonmagic.com` with 30-day and 90-day ranges.
2. Give top billing to posts less than 2 weeks old. The newest post should be `featured: 1` with `new: true`; other still-new posts follow in reverse-chronological order.
3. Fill the remaining featured slots with the strongest existing posts by Plausible performance, preferring posts that are strong in both 30-day and 90-day views.
4. Keep exactly 4 posts with numeric `featured` values and remove `featured` from posts that fall out of the homepage set.
5. Use badges only when they are still accurate, such as `new: true` for posts less than 2 weeks old or `popular: true` for data-backed high-traffic posts.

## Project skills

- `blog-post-creator`: use when creating or updating blog posts.
- `jonmagic-site`: use for site conventions and structure.
- `tsrs-release-site`: use only for Tri-State Relay Service release updates.

## Planning and estimates

Do not estimate duration, staffing, or delivery timelines unless @jonmagic explicitly asks. Prefer sequencing, dependencies, risks, decision gates, owner asks, and assumptions.

## Agent hygiene

- Keep changes focused and source-backed.
- Do not introduce dependencies unless necessary and approved after dependency-safety review.
- Do not commit or push unless @jonmagic explicitly asks.
- Use this `AGENTS.md` as the canonical project instruction file. Do not add `.github/copilot-instructions.md`.
