---
name: blog-post-creator
description: Create new blog posts for jonmagic.com with correct frontmatter, file naming, and structure. Use when starting a new blog post or article. Integrates with voice-and-tone skill for writing style.
---

# Blog Post Creator

Create blog posts for jonmagic.com following established conventions.

## Related Skills

- **voice-and-tone**: Apply when writing post content
- **who-am-i**: Use for biographical context if needed

## File Conventions

- **Location**: `src/posts/`
- **Naming**: `kebab-case-title.md` (lowercase, hyphens, no dates in filename)
- **Images**: `src/images/posts/{post-slug}/` (use `.webp` format)

## Frontmatter Template

```yaml
---
title: Your Post Title Here
date: 2025-01-30
tags:
  - post
description: >-
  A 1-2 sentence description for SEO and post previews.
  Keep under 160 characters ideally.
---
```

### Optional Frontmatter Fields

```yaml
avatar: /images/posts/post-slug/custom-avatar.webp  # Custom post avatar
featured: 1  # Numeric value for homepage featuring (lower = higher priority)
layout: layout  # Usually omit; defaults to layout.njk
```

## Process

1. **Determine the slug**
   - Convert title to kebab-case
   - Example: "My First 30 Years in Tech" → `my-first-30-years-in-tech.md`

2. **Create the post file**
   - Path: `src/posts/{slug}.md`
   - Add frontmatter with required fields

3. **Create images directory** (if needed)
   - Path: `src/images/posts/{slug}/`
   - Convert images to `.webp` format

4. **Write content**
   - Apply voice-and-tone skill
   - Use Markdown with standard formatting
   - Images: `![alt text](/images/posts/{slug}/image-name.webp)`

5. **Update homepage featured posts**
   - Follow the Featured Posts Selection steps below

6. **Create social redirects** (if the post will be promoted)
   - Follow the Social Redirects section below

7. **Build and preview**
   - Run `npm run start` to build and serve locally
   - Verify post appears correctly

## Social Redirects

When a post will be shared on social platforms, create short first-party redirect pages so social copy can use readable URLs while Plausible still receives channel attribution.

Use the shortest useful slug for the social link, not necessarily the full post slug:

```text
src/li/{short-slug}.njk    -> /li/{short-slug}/
src/bsky/{short-slug}.njk  -> /bsky/{short-slug}/
src/x/{short-slug}.njk     -> /x/{short-slug}/
```

Each redirect page should:

- use `layout: false` and `eleventyExcludeFromCollections: true`,
- use `meta name="robots" content="noindex, follow"`,
- set `link rel="canonical"` to the real post URL,
- include useful OG/Twitter title, description, and image metadata,
- redirect with meta refresh, JavaScript, and a normal fallback link,
- use relative redirect targets so local testing stays on `localhost`,
- keep UTM params minimal: `utm_source=<channel>` and `utm_medium=social`.

Example redirect target:

```text
/posts/my-post/?utm_source=linkedin&utm_medium=social
```

Do not add more UTM parameters unless there is a concrete measurement need.

## Featured Posts Selection

The homepage shows up to 4 featured posts. Publishing a post includes updating the featured set.

### Steps

1. **Find all currently featured posts**
   - Search `src/posts/*.md` for files containing `featured:` in their frontmatter
   - Note each post's current `featured` value

2. **Query Plausible before choosing non-new posts**
   - Use `~/.copilot/skills/plausible-site-stats/scripts/plausible-stats top-pages --range 30d --limit 30`
   - Use `~/.copilot/skills/plausible-site-stats/scripts/plausible-stats top-pages --range 90d --limit 30`
   - Do not print or store Plausible credentials

3. **Give new posts top billing**
   - Posts less than 2 weeks old should appear first
   - The newest post should be `featured: 1` with `new: true`
   - Other still-new posts follow in reverse-chronological order

4. **Fill the remaining slots from data**
   - Pick the strongest existing posts from Plausible, preferring posts that are strong in both 30-day and 90-day windows
   - Add `popular: true` only when a post is data-backed as a high-traffic homepage choice
   - Remove `featured` from posts that fall out of the 4-slot set

5. **Keep the homepage set exact**
   - Exactly 4 posts should have numeric `featured` values
   - The `featured` filter in `.eleventy.js` sorts ascending, so lower numbers appear first
   - Removing the `featured` field is the correct way to un-feature a post
   - Each featured post should use a different `accent` value so homepage cards are visually distinct
   - Use `new: true` only for the latest less-than-2-week-old post, and use `popular: true` when a post is a data-backed high-traffic homepage choice

### Example selection

| # | Post |
|---|------|
| 1 | Newest post less than 2 weeks old |
| 2 | Another post less than 2 weeks old |
| 3 | Strongest 30d/90d Plausible post |
| 4 | Next strongest 30d/90d Plausible post |

### Important Notes

- If Plausible is unavailable, do not guess. Keep the current featured set except for adding the new post at the top and note that data-backed selection could not be completed.

## Frontmatter Examples

See `references/frontmatter-examples.md` for real examples from existing posts.

## Tags

All blog posts require the `post` tag. Additional tags are not currently used but can be added for future filtering.
