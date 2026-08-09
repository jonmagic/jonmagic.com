---
title: GitHub Copilot Session Search and Resume CLI
date: 2026-04-12
tags:
  - post
description: >-
  Copilot now has built-in session search and resume. The original CLI and a current look at the local session data under ~/.copilot/ are preserved here.
featured: 3
accent: green
popular: true
eyebrow: "TOOL · 2026"
disableMerchCta: true
kit:
  - label: Repo
    text: jonmagic/copilot-sessions
    url: https://github.com/jonmagic/copilot-sessions
    target: copilot-sessions
  - label: Docs
    text: Resume Copilot CLI sessions
    url: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview#resume-an-interactive-session
    target: copilot-cli-sessions
  - label: VS Code
    text: Sync and query session history
    url: https://code.visualstudio.com/docs/agents/run/sessions/session-history
    target: vscode-session-history
  - label: Related
    text: How I Work, 2025 Edition
    url: /posts/how-i-work-2025-edition/
    target: how-i-work-2025
    internal: true
  - label: Discuss
    text: Discussion on this post
    url: https://github.com/jonmagic/jonmagic.com/discussions
    target: site-discussions
---

> [!NOTE]
> I updated this post on August 9, 2026. Copilot CLI and VS Code now have built-in tools for finding previous sessions, so I recommend starting with the [Copilot CLI resume documentation](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview#resume-an-interactive-session) and the [VS Code session history documentation](https://code.visualstudio.com/docs/agents/run/sessions/session-history). I kept the original tool and the `~/.copilot/` notes below because the local session data is still useful to understand and build on.

Last week I switched to [copilot-cli](https://docs.github.com/en/copilot/how-tos/copilot-cli) as my full-time coding agent. I'd been splitting my time between it and [opencode](https://opencode.ai) for months, using Copilot a few times a week, gravitating back to opencode for daily work. But after returning from two weeks of vacation to a fresh laptop, I committed to using only the latest copilot-cli for a full week. By the end of it I sent this to the team internally:

> I gotta say, things are finally at the point where I'm not tempted to switch back to opencode. Amazing work everyone. I'm going to start annoying my friends that still use claude code and get them to try switching to copilot again.

One friction point lingered though. Finding my way back to previous sessions. Copilot has since fixed that directly in the CLI.

## e-too-many-sessions

I run multiple Copilot sessions a day across different folders and repos. My [Brain](https://jonmagic.com/posts/context-rules-everything-around-me/) (personal knowledge base), work projects, side projects, home automation. Open a tab, start a session, do some work, close it, move on. An hour later I'd think "I need to pick that back up" and have no idea which session it was. My workaround was manually copy-pasting session IDs into my [weekly note](https://jonmagic.com/posts/context-rules-everything-around-me/) so I could `copilot --resume=<uuid>` later. It worked, but it felt wrong.

## Use the built-in session tools now

Copilot CLI now includes `/resume`, which opens a session picker, and `copilot --continue`, which resumes the most recently closed local session. You can also pass a session ID or name to `/resume`. The [Copilot CLI documentation](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview#resume-an-interactive-session) has the current commands.

Session search has moved well beyond the fuzzy title search I built here. Chronicle can search by keyword, file path, pull request, or issue reference with `/chronicle:search <query>`, and you can ask natural-language questions about previous work. VS Code can sync local sessions to your GitHub account and query sessions from VS Code, Copilot CLI, coding agent, code review, and the GitHub Copilot Desktop app. The [VS Code session history documentation](https://code.visualstudio.com/docs/agents/run/sessions/session-history) covers search, sync, privacy controls, deletion, and reindexing.

## ~/.copilot/ :eyes:

Copilot CLI still stores its local state under `~/.copilot/`. Each local session gets a directory under `session-state/` with a `workspace.yaml` metadata file and, for active sessions, an `events.jsonl` event log. Some sessions have additional files such as `session.db`, plans, checkpoints, or VS Code metadata. The exact files vary by Copilot version and how the session was created.

The other useful file is still `session-store.db`, a SQLite database Copilot maintains automatically.

```
~/.copilot/
├── config.json
├── session-state/           # One directory per session
│   └── <uuid>/
│       ├── events.jsonl     # Event stream when present
│       ├── workspace.yaml   # Session metadata
│       └── ...              # Other files vary by session and version
├── session-store.db         # Searchable local session index
└── mcp-config.json
```

I opened `session-store.db` with `sqlite3`. It has gained more internal tables since I first wrote this post, but these core session tables are still there.

| Table | What's in it |
|-------|-------------|
| `sessions` | ID, auto-generated summary, repository, branch, timestamps |
| `turns` | Every user message and assistant response |
| `checkpoints` | Titled snapshots with overviews and next steps |
| `session_files` | Every file touched during the session |
| `session_refs` | Commits, PRs, and issues linked to the session |
| `search_index` | FTS5 full-text search across all content |

That last one caught my eye. Copilot maintains an [FTS5 full-text search index](https://www.sqlite.org/fts5.html) across session content, along with human-readable summaries in the `sessions` table. That local index is now used by built-in session history features, but it is still available if you want to explore your own data.

## copilot-sessions

Once I understood the data, the tool was straightforward. Query the database, pipe through [fzf](https://github.com/junegunn/fzf) for interactive fuzzy search, resume the chosen session:

```bash
# Browse recent sessions
cs

# Search for a session
cs home assistant

# List without fzf
cs -l
```

The output looks like this:

```
  TIME     REPO             SESSION
  11m ago  brain            Home Assistant Automation Ideas
  1h ago   brain            Research Copilot CLI Theme
  4h ago   brain            Review And Seed Spotify Playlist
  13h ago  brain            Enable Ghostty SSH Terminal
```

Pick one, hit Enter, and Copilot resumes right in your terminal. `ctrl-y` copies the session ID to clipboard if you need it elsewhere.

Search uses fzf's fuzzy matching against session summaries, all user messages, and repository names. That means it's typo-tolerant. `mincraft` finds your Minecraft session, `sptoify` finds Spotify. It supports substring matching and multi-word queries too. The user messages are appended off-screen so fzf can match against them without cluttering the display.

All the formatting (relative timestamps, repo name truncation, column layout) happens inside a single SQLite query. No bash loops or per-row shell-outs. Startup is about 20ms for hundreds of sessions.

I published it as [copilot-sessions](https://github.com/jonmagic/copilot-sessions). It is still a useful example of querying the local database and it has a compact `fzf` workflow, but most people should use Copilot's built-in session tools now.

> [!WARNING]
> Treat `session-store.db` and the files under `session-state/` as internal implementation details. The schema and event format can change between Copilot releases. I no longer recommend deleting or modifying rows directly. Use the built-in session deletion and privacy controls described in the VS Code documentation.

## ...one more thing

When present, `events.jsonl` is still a streaming log of what happened in a session. It includes user and assistant turns, tool activity, model changes, hooks, and session lifecycle events, all with timestamps. The event payloads evolve, but the broad structure still looks like this:

```jsonl
{"type":"session.start","timestamp":"...","data":{"context":{"repository":"jonmagic/copilot-sessions","branch":"main"}}}
{"type":"user.message","timestamp":"...","data":{"content":"..."}}
{"type":"assistant.turn_start","timestamp":"...","data":{"turnId":"..."}}
{"type":"tool.execution_start","timestamp":"...","data":{"toolName":"...","arguments":{...}}}
{"type":"tool.execution_complete","timestamp":"...","data":{"success":true}}
{"type":"session.shutdown","timestamp":"...","data":{...}}
```

There's still a lot you could build on this. Session analytics, cross-session file search, timeline visualizations. I am glad the basic search and resume problem no longer needs a separate tool though.

> [!NOTE]
> I work at GitHub, which helped me confirm some of the original findings by reviewing internal code. Everything described in the updated `~/.copilot/` section is observable with Copilot CLI installed, but these files are not a supported public API and may change.
