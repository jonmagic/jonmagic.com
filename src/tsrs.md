---
layout: layout
title: Tri-State Relay Service
description: >-
  A free macOS app for hearing short agent updates when you are ready for them,
  without watching every agent session.
permalink: /tsrs/
analyticsProject: tri-state-relay-service
analyticsTopic: agent-updates
---

<section class="tsrs-hero">
  <img class="tsrs-icon" src="/images/tsrs/AppIcon.png" alt="Tri-State Relay Service app icon" width="160" height="160">
  <div class="tsrs-hero-copy">
    <p class="tsrs-kicker">A local macOS relay for agent updates</p>
    <p class="tsrs-deck">Short audio updates make agent work easier to re-enter without keeping every agent window in view.</p>
    <a class="tsrs-download-button" href="/downloads/Tri-State%20Relay%20Service-1.0.0-macos-arm64.zip" data-plausible-event-name="TSRS Download" data-plausible-event-target="macos-1.0.0-arm64">Download for macOS</a>
  </div>
</section>

Tri-State Relay Service is a local macOS app and CLI where agents leave short updates in a queue. Each project or context gets a line. A line can stay quiet while you are focused, wait with an update, and become active when you choose to listen.

The story behind this started while I was helping my daughter build a game with AI. I wrote about that in [The Feedback Loop I Was Missing](/posts/the-feedback-loop-i-was-missing/).

It is free to download. I may open source it someday, but for now I mostly want people to try it and tell me whether the feedback loop helps. If you try it, [leave feedback in this GitHub Discussion](https://github.com/jonmagic/jonmagic.com/discussions/13).

<!-- TODO media: product demo clip. Replace with:
<video src="/images/tsrs/product-demo.mp4" controls width="100%"></video>
-->

## Current release

**1.0.0 — Initial public release**

Tri-State Relay Service is now available as a signed direct-download macOS app. This release adds visible app and CLI versioning, and the download button points directly at the versioned release archive.

The app and `relay` CLI should both report `1.0.0`.

## Getting started

The fastest path is to get the app running, prove one relay works by hand, and only then wire it into your agents.

### 1. Download and open the app

Download the zip, unzip it, and open the app. On first launch, Tri-State Relay Service opens Settings directly to the **Setup** panel.

If macOS blocks the app the first time you open it, right-click the app and choose **Open**. This is a direct-download build, not a Mac App Store install.

### 2. Walk through Setup

The Setup panel has three steps.

1. **Install the CLI.** Click **Install relay CLI to /usr/local/bin**. This gives agents a normal `relay` command to run. If you would rather not install it globally, click **Copy bundled CLI path** and use that full path in your agent instructions.
2. **Record the shortcut.** Click the shortcut button and press the key combination you want. The default is `Control` + `Option` + `Command` + `Space`.
3. **Open at Login.** Turn this on if you want TSRS to start when you log in. It still starts quiet, so relays queue until you ask to hear one.

Setup is quiet on purpose. The app starts in Focus mode, so a silent app after setup usually means it is working, not stuck.

### 3. Send one relay yourself

Before adding agent instructions, make sure the app and CLI can talk to each other.

```sh
relay --version
relay --line "Test" --message "Setup check."
relay list
relay ready
```

`relay list` should show the test update. `relay ready` releases one relay and then returns the app to quiet mode.

If `relay --version` fails, open Settings and run the CLI install again. If the install reports a conflict, a different `relay` already exists at `/usr/local/bin/relay`. TSRS will not overwrite it silently. Replace it from Settings, remove the old command yourself, or use the bundled CLI path in your agent instructions.

If `relay ready` queues but does not speak, check whether the app is muted or whether your microphone appears active. TSRS waits rather than speaking over you while another app is using the mic.

### 4. Add it to your global agent instructions

Once the manual relay works, add the instructions below wherever your coding agent reads global instructions. A project-level instruction is fine for trying it, but global instructions are where this becomes useful across projects.

If your agent ignores softer instructions, use this stricter version. The important part is telling the agent this is mandatory and tying it directly to tool use.

<button class="tsrs-copy-button" type="button" data-copy-next-code>Copy instructions</button>

````md
## Relay updates

This is a mandatory operating rule, not a nice-to-have. Use short relay updates
so I can follow agent progress without watching the session.

If a response will use any tool for investigation, editing, validation,
delegation, or documentation lookup, send a relay update before or in the same
tool-calling turn as the first tool call. Do not treat "just checking" or "small
tool use" as exempt.

Send an update before or when one of these things happens.

1. Starting a meaningful work slice.
2. Switching phases, such as from investigation to implementation.
3. Beginning a long-running validation or build.
4. Getting blocked or needing human input.
5. Completing a slice with a useful outcome.
6. Suggesting the next concrete step.
7. Confirming the final answer after using tools when the outcome matters. Say
   the conclusion in plain English, not just that validation completed.

When both a normal text preamble and a relay update would apply, the relay
update is the source of truth for progress updates. A short text preamble may
accompany it, but it does not replace the relay update unless the relay command
fails.

Keep updates brief and intentional. Say what is happening or what changed, not
raw details. Do not include code, logs, terminal output, file contents, secrets,
private data, or long explanations.

Use the `relay` command when it is available. Enqueue updates with `--line`.
Choose the line from the agent's current working directory, not from the topic
being researched. Prefer the current git repository or project folder name. If
there is no repository, use the nearest meaningful folder name. Mention
cross-project research targets in the message text, not by changing the line.

```sh
relay \
  --line "PROJECT OR CONTEXT NAME" \
  --type update \
  --priority normal \
  --cwd "$PWD" \
  --message "I am starting the next implementation slice."
```

Use `--type complete` for completion updates and `--priority high` only when the
message needs prompt human attention. Include `--cwd` unless the path itself is
sensitive. If `relay` is missing or the command fails, do not spend time
debugging it during unrelated work. Fall back to a short text status message and
continue the task.

Do not trigger system text-to-speech directly. The app owns playback so multiple
agent sessions share one safe speaker.
````

### 5. Try it with an agent

Start a small agent task in any project. You should see relays queue as the agent works. When you are ready to hear one, use **Play Next** from the menu bar app or run:

```sh
relay ready
```

The app speaks one eligible relay and goes quiet again.

## Using relays day to day

A relay is a short, human-readable update from an agent. It should sound like a teammate briefly saying what changed, not like a log dump.

Good moments for relays are:

1. Starting a meaningful work slice.
2. Switching phases, such as from investigation to implementation.
3. Getting blocked or needing input.
4. Finishing something useful.

Avoid raw command output, logs, code, secrets, private data, or long explanations. If the message would be annoying to hear out loud, it is probably too much.

Good examples:

```sh
relay --line "My Project" --type update --message "The tests are running now."
relay --line "My Project" --type complete --message "The draft is ready to review."
relay --line "My Project" --priority high --message "I’m blocked and need your choice before continuing."
```

### Lines keep work streams separate

A line is a named work stream. If you only have one agent working on one project, one line may be enough. If you have several agents working at once, lines make it easier to understand which update belongs where.

```sh
relay --line "Website" --message "I found the broken image path."
relay --line "API" --message "The auth test failure is isolated."
```

The active line is the line the app plays from automatically when you ask for the next relay. Other lines stay queued until you switch to them or pull from them directly.

Useful line commands:

```sh
relay line
relay line "Website"
relay list
```

If you often run more than one agent in the same project, add this to your global instructions too:

```text
At the start of each session, ask me what the relay line should be called. An empty answer is fine and means to use the current project or folder name. Use that line for all updates during the session.
```

You can combine that with a default line rule:

```text
Choose the default line from the current working directory. Prefer the git repository or project name. Mention cross-project research in the message text instead of changing the line.
```

### Focus, Ready, and Mute

The app is designed to be quiet by default.

Focus mode queues relays without speaking. Ready mode releases one relay, then returns to Focus. Mute prevents playback even if relays are queued.

Common commands:

```sh
relay list
relay ready
relay mute
relay unmute
relay acknowledge
relay clear-delivered
```

In the menu bar app, left click for the fastest Play Next path. Right click opens the command palette. Your keyboard shortcut opens the command palette with Play Next selected, so pressing Return immediately plays the next eligible relay.

The app owns playback. The CLI submits and manages relays, but it does not speak directly.

### Voice and settings

Open Settings whenever you want to change the CLI install, keyboard shortcut, Open at Login, or voice.

Changing the voice is quiet. Use Preview only when you explicitly want to hear a sample. To add more macOS voices, open System Settings > Accessibility > Spoken Content.

Direct-download builds use app-owned playback and can use installed macOS voices that work with the system speech engine. Natural voices are favored when available, and System Default remains available.

### When many updates pile up

When you are focused on one line, other lines may collect several updates. This stays manageable by showing or playing the latest useful update for an inactive line instead of making you hear every stale intermediate message.

For many people, the default behavior is enough. You can work on one line, then switch lines when you are ready to catch up.

## Advanced inactive-line Combiner

The Combiner is for people who want an external agent or command to summarize many queued inactive-line updates into one short relay. It is useful when you run several agents at once and want a catch-up that sounds like a concise teammate summary.

You can inspect or change the Combiner from the CLI.

```sh
relay combiner
relay combiner --command "llm prompt <input> --system <system> --no-stream --no-log"
relay combiner --command none
```

The command template receives the inactive-line updates as input and should return one safe, short message. Leave the Combiner unset if you prefer the simpler latest-update behavior.

Combiner output should follow the same rules as any other relay. No secrets, no raw logs, no code dumps, and no long explanations.

## Troubleshooting

Most first-run surprises are quiet by design, not failures.

**Agents cannot find `relay`.** The CLI is not installed, `/usr/local/bin` is not on your `PATH`, or your agent cannot see the same shell environment as your terminal. Open Settings and install or refresh the CLI, then run `relay --version` in a new terminal. If you do not want to install it, copy the bundled CLI path from Settings and use that full path in your agent instructions.

**Install reports a conflict or permission error.** A different `relay` already exists at `/usr/local/bin/relay`, or macOS needs permission to install there. Let Settings replace it, remove the old file yourself, or use the bundled CLI path.

**Relays queue but never speak.** Check whether the app is in Focus mode, muted, or waiting because a microphone appears active. Use `relay list` to confirm what is waiting, then `relay ready` or Play Next to release one.

**The app launched silent after Open at Login.** That is expected. Open at Login starts in Focus mode so relays queue quietly until you ask to hear one.

**An agent read raw logs or secrets aloud.** Tighten your agent instructions so relays carry short, human-authored summaries only. No code, logs, terminal output, secrets, or private data.

The local queue lives on your Mac here:

```text
~/Library/Application Support/Tri-State Relay Service/relay.db
```

You usually do not need to touch that file. It is listed here only so you know where your local queue data lives.
