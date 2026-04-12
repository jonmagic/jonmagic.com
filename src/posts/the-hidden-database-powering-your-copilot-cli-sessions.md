---
title: The Hidden Database Powering Your Copilot CLI Sessions
date: 2026-04-12
tags:
  - post
description: >-
  I discovered that the Copilot CLI maintains a SQLite database with full-text search across all your sessions. Here's how it works and the 50-line script I built to search and resume sessions instantly.
featured: 1
---

I've been using the Copilot CLI as my primary coding tool for months now. Multiple sessions a day across different repos — Brain, work projects, side projects, home automation. The problem I kept hitting was remembering which sessions to go back to. I'd finish a session, close the tab, start something new, and then an hour later think "wait, I need to pick that back up." My workaround was embarrassing: manually copy-pasting session IDs into my notes so I could find them later.

There had to be a better way. So I went looking.

## What's inside ~/.copilot/

The Copilot CLI stores all its state in `~/.copilot/`. If you've used it, you already have this directory. Here's what's in there:

```
~/.copilot/
├── config.json              # Your settings (model, theme, trusted folders)
├── session-state/            # One directory per session
│   ├── <uuid>/
│   │   ├── events.jsonl      # Every event that happened in the session
│   │   ├── workspace.yaml    # Session metadata
│   │   ├── plan.md           # The session's plan (if any)
│   │   └── checkpoints/      # Checkpoint snapshots
│   └── ...
├── session-store.db          # <-- This is the interesting one
├── data.db                   # Project/workspace management
└── mcp-config.json           # MCP server configuration
```

The `session-state/` directory has the raw data — one folder per session with a JSONL event log and YAML metadata. But the real gem is `session-store.db`.

## The session database

`session-store.db` is a SQLite database that the CLI maintains automatically. I opened it with `sqlite3` and ran `.tables`:

```
checkpoints           search_index_content  session_files
schema_version        search_index_data     session_refs
search_index          search_index_docsize  sessions
search_index_config   search_index_idx      turns
```

That's a lot more than I expected. Let me walk through what's in each table.

### sessions

The main index. Every session you've ever run:

```sql
SELECT id, summary, repository, branch, updated_at
FROM sessions ORDER BY updated_at DESC LIMIT 5;
```

```
c7a875cd...  Copilot CLI Vs Claude Code Pricing   jonmagic/brain     main  2026-04-12T18:20:34Z
e003e28d...  Find And Clone Copilot Agent          jonmagic/brain     main  2026-04-12T17:53:33Z
90b976b6...  Remediate Issue 3152                  github/endpoint-…  main  2026-04-12T17:43:46Z
```

The CLI auto-generates those summaries. No LLM call needed — they're already there.

### turns

Every conversation turn, with both the user message and assistant response:

```sql
SELECT turn_index, substr(user_message, 1, 80) FROM turns
WHERE session_id = 'e003e28d-...' AND turn_index = 0;
```

```
0  Please search the github org to find the github copilot agent app that they are…
```

### search_index (FTS5)

This is the one that made me sit up. The CLI maintains an [FTS5 full-text search index](https://www.sqlite.org/fts5.html) across all session content. That means you can do this:

```sql
SELECT DISTINCT s.id, s.summary
FROM sessions s
INNER JOIN search_index si ON si.session_id = s.id
WHERE si.content MATCH 'home assistant'
ORDER BY s.updated_at DESC;
```

```
e003e28d...  Find And Clone Copilot Agent
896adeb2...  Home Assistant Automation Ideas
5b323ad7...  Inspect Home Assistant Configuration
a11b17be...  Set Up Home Assistant On Synology
```

Sub-millisecond full-text search across every conversation you've ever had with Copilot. That's powerful.

### checkpoints

Titled snapshots with overviews — these are created during longer sessions:

```sql
SELECT checkpoint_number, title, substr(overview, 1, 100)
FROM checkpoints WHERE session_id = 'a11b17be-...';
```

```
1  Home Assistant skill pivot  The user wanted to run the latest Home Assistant on their Synology NAS…
```

### session_files and session_refs

The CLI tracks every file it touched and every commit, PR, or issue it referenced:

```sql
SELECT file_path, tool_name FROM session_files
WHERE session_id = 'e003e28d-...' LIMIT 3;
```

```
/Users/jonmagic/Brain/Daily Projects/2026-04-12/03 copilot session…  create
```

## The raw event log

Beyond the database, each session's `events.jsonl` file is a streaming log of everything that happened. Each line is a JSON object with a type:

```jsonl
{"type":"session.start","timestamp":"2026-04-12T17:51:44Z","data":{"sessionId":"e003e28d-...","context":{"cwd":"/Users/jonmagic/Brain","repository":"jonmagic/brain","branch":"main"}}}
{"type":"user.message","timestamp":"...","data":{"content":"Please search the github org..."}}
{"type":"tool.execution_start","timestamp":"...","data":{"toolCallId":"call-1","toolName":"grep","arguments":{"pattern":"copilot"}}}
{"type":"tool.execution_complete","timestamp":"...","data":{"toolCallId":"call-1","success":true}}
{"type":"assistant.message","timestamp":"...","data":{"content":"I found several repos..."}}
{"type":"session.shutdown","timestamp":"...","data":{"modelMetrics":{"gpt-5.4":{"usage":{"inputTokens":192048,"outputTokens":3660}}}}}
```

Event types include `session.start`, `user.message`, `assistant.message`, `tool.execution_start`, `tool.execution_complete`, `skill.invoked`, `session.shutdown`, and more. The shutdown event includes token usage and model metrics for the entire session.

The `workspace.yaml` file alongside it has the session metadata:

```yaml
id: e003e28d-972e-401a-a837-80bf69720d84
cwd: /Users/jonmagic/Brain
repository: jonmagic/brain
branch: main
summary: Find And Clone Copilot Agent
created_at: 2026-04-12T17:51:44.576Z
updated_at: 2026-04-12T17:53:33.918Z
```

## Building a session finder

Once I understood the data, the tool almost wrote itself. The database already has everything: summaries, timestamps, full-text search. All I needed was a way to browse it interactively and resume the selected session.

Here's the core of it:

```bash
# Query sessions with optional FTS5 search
sqlite3 -separator '|' ~/.copilot/session-store.db "
  SELECT s.id,
    COALESCE(s.summary, substr(t.user_message, 1, 80), '(no summary)'),
    COALESCE(s.repository, ''),
    s.updated_at
  FROM sessions s
  LEFT JOIN turns t ON t.session_id = s.id AND t.turn_index = 0
  ORDER BY s.updated_at DESC
  LIMIT 100
"
```

Pipe that through [fzf](https://github.com/junegunn/fzf) for interactive fuzzy finding, extract the session ID from the selected line, and resume:

```bash
exec copilot --resume="$session_id"
```

The full script adds relative timestamps ("2h ago", "3d ago"), column formatting, full-text search when you pass a query, and `Ctrl-Y` to copy a session ID to clipboard. I aliased it to `cs` so the full workflow is:

1. Open a new terminal tab
2. Type `cs` (or `cs home assistant` to search)
3. Pick a session
4. Copilot resumes right there

The whole thing runs in milliseconds because it's just SQLite.

I published it as [copilot-sessions](https://github.com/jonmagic/copilot-sessions) if you want to try it. It's about 130 lines of bash.

## What else could you build?

Now that I know this data exists, I keep thinking about what else is possible:

- **Session analytics** — which repos do I spend the most time in? Which tools does Copilot call most often?
- **Session tagging** — add your own metadata to sessions for better organization
- **Cross-session search** — "show me every session where I edited this file"
- **Session export** — generate a summary document from a session's turns and tool calls
- **IDE integration** — surface recent sessions in a VS Code sidebar or command palette

The raw data in `events.jsonl` is especially rich. Every tool call, every file edit, every shell command — all with timestamps. You could build detailed timelines of what Copilot did and how long each step took.

> [!NOTE]
> Full disclosure: I work at GitHub, so I was able to confirm some of my findings by reviewing internal code. But everything described in this post is observable by anyone with the Copilot CLI installed — just open `~/.copilot/` and start exploring.

The Copilot CLI is more hackable than most people realize. The data is right there on your filesystem, in standard formats (SQLite, JSONL, YAML), waiting for you to build on it.
