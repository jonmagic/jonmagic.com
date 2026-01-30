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

5. **Build and preview**
   - Run `npm run start` to build and serve locally
   - Verify post appears correctly

## Frontmatter Examples

See `references/frontmatter-examples.md` for real examples from existing posts.

## Tags

All blog posts require the `post` tag. Additional tags are not currently used but can be added for future filtering.
