# Frontmatter Examples

Real examples from jonmagic.com blog posts showing different frontmatter configurations.

## Standard Post (Minimal)

```yaml
---
title: GitHubber
date: 2011-12-05T00:00:00.000Z
tags:
  - post
  - migrated
description: >-
  Ordered List crew joins GitHub! Exciting new chapters, dream resets, and
  awesome opportunities. Together, we're ready to build something incredible.
---
```

## Post with Custom Avatar

```yaml
---
title: How I Work, 2025 Edition
date: 2025-12-16
avatar: /images/posts/how-i-work-2025-edition/reflecting-and-enjoying-a-whiskey.webp
tags:
  - post
description: >-
  Optimizing for your own brain, not someone else's system. How I use Markdown
  files in VS Code as my single source of truth, leverage Copilot as a pair
  partner, and capture everything from meetings to voice memos.
featured: 2
---
```

## Featured Post

The `featured` field is a numeric value that determines homepage featuring:
- Lower numbers appear first
- Only posts with a numeric `featured` value appear in the featured section

```yaml
---
title: Designing Collaborations, Not Just Automations
date: 2025-09-01
tags:
  - post
description: >-
  AI assistants can do tasks for you or with you. Here's why designing
  collaborations beats pure automation.
featured: 1
---
```

## Migrated Post (Legacy)

Older posts migrated from previous blog platforms include the `migrated` tag:

```yaml
---
title: Ten Years a Software Engineer
date: 2016-12-05T00:00:00.000Z
tags:
  - post
  - migrated
description: >-
  Reflecting on 10 years from tinkering to becoming a Senior Engineer at GitHub,
  exploring retrospectives, and diving into the exciting world of Machine
  Learning.
---
```

## Date Formats

Both formats work:
- ISO 8601 with time: `2011-12-05T00:00:00.000Z`
- Simple date: `2025-01-30`

Use simple date format for new posts.
