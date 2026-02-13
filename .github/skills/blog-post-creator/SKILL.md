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

5. **Rotate featured posts** (if featuring the new post)
   - Follow the Featured Posts Rotation steps below

6. **Build and preview**
   - Run `npm run start` to build and serve locally
   - Verify post appears correctly

## Featured Posts Rotation

The homepage shows up to 4 featured posts. When publishing a new post that should be featured, rotate the stack:

### Steps

1. **Find all currently featured posts**
   - Search `src/posts/*.md` for files containing `featured:` in their frontmatter
   - Note each post's current `featured` value

2. **Remove the oldest featured post from the stack**
   - The post with `featured: 4` (the highest number) gets dropped
   - Remove the `featured` field entirely from that post's frontmatter

3. **Renumber remaining featured posts**
   - Increment each remaining post's `featured` value by 1
   - `featured: 3` becomes `featured: 4`
   - `featured: 2` becomes `featured: 3`
   - `featured: 1` becomes `featured: 2`

4. **Add the new post as featured #1**
   - Add `featured: 1` to the new post's frontmatter

### Example

Before rotation:
| # | Post |
|---|------|
| 1 | Post A |
| 2 | Post B |
| 3 | Post C |
| 4 | Post D |

After rotation (new Post E published):
| # | Post |
|---|------|
| 1 | Post E (new) |
| 2 | Post A |
| 3 | Post B |
| 4 | Post C |

Post D is no longer featured (its `featured` field is removed).

### Important Notes

- Always confirm with the user before modifying featured posts
- The `featured` filter in `.eleventy.js` sorts ascending (lower number = higher priority)
- Only posts with a numeric `featured` value appear in the featured section
- Removing the `featured` field (not setting it to 0 or null) is the correct way to un-feature a post

## Frontmatter Examples

See `references/frontmatter-examples.md` for real examples from existing posts.

## Tags

All blog posts require the `post` tag. Additional tags are not currently used but can be added for future filtering.
