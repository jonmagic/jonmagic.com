---
layout: layout
title: Tri-State Relay Service
description: >-
  A small macOS relay queue for hearing agent updates when I am ready to switch
  focus, inspired by helping my kid code with AI.
permalink: /tsrs/
---

<section class="tsrs-hero">
  <img class="tsrs-icon" src="/images/tsrs/AppIcon.png" alt="Tri-State Relay Service app icon" width="160" height="160">
  <div class="tsrs-hero-copy">
    <p class="tsrs-kicker">A local macOS relay for agent updates</p>
    <p class="tsrs-deck">Tri-State Relay Service keeps agent status updates quiet until I am ready to hear the next useful one.</p>
    <a class="tsrs-download-button" href="/downloads/Tri-State%20Relay%20Service-0.1.0-macos-arm64.zip" data-plausible-event-name="TSRS Download" data-plausible-event-target="macos-arm64-0.1.0">Download for macOS arm64</a>
    <p class="tsrs-hotkey-callout">After starting TSRS, press <kbd>Control</kbd><kbd>Option</kbd><kbd>Command</kbd><kbd>Space</kbd> to activate it and hear the next queued update.</p>
    <p class="tsrs-caveat">This is an early local build. It is unsigned, so macOS may ask you to approve it before it runs.</p>
  </div>
</section>

## It started with my kid

I started building Tri-State Relay Service because I was trying to help my 8yo kid make their own game with AI.

Voice input made the collaboration feel possible in a way typing did not. They could speak to an agent like Copilot or Claude and stay in the flow of describing the game they wanted to make. That solved half of the loop.

The other half was feedback.

They needed the agent to speak back in short [ELI5](https://simple.wikipedia.org/wiki/ELI5) updates. Not terminal output. Not a long explanation. Just enough audio to know work was starting, something had changed, or a step was ready for them to try.

The first version was not an app. It was a project-level agent instruction that told the agent when to speak and how short to keep it.

## The missing feedback loop

That pattern worked because the updates were intentional. The agent did not narrate every command or read a transcript of its terminal output. It said something useful before a work slice, at key checkpoints, when blocked, and when something was ready for feedback or user testing.

After about an hour of using it with my kid, I noticed it helped me too.

**Audio triggered a different part of my brain than text on a screen. It made the agent's state easier to re-enter.** That connected to a problem I kept running into with my own work, where I might have multiple agents running but I can only focus on one project at a time.

The important part is not just that the message is audio. It is that the audio arrives when I ask for it, from the line I am ready to hear, without turning every agent into a noisy interruption machine.

## What TSRS does

TSRS is a local macOS toolbar app and CLI for brief agent status updates.

Agents send short, intentional updates to a local relay queue. Each project or context gets a line. The app stays quiet by default while I am focused. When I am ready to switch context, I use the hotkey to hear the next useful update and move to that line.

> [!NOTE]
> The tri-state part is the mental model: an agent line is either quiet while I am focused somewhere else, queued when it has something worth hearing, or active when I choose to listen and switch into that context.

The goal is audio feedback on demand, not constant interruption.

## Add it to your agent instructions

Paste this into your agent instructions if you want agents to send updates to TSRS. It assumes the `relay` command is available on your `PATH`.

<button class="tsrs-copy-button" type="button" data-copy-next-code>Copy instructions</button>

````md
## Tri-State Relay Service updates

Use short Tri-State Relay Service updates so I can follow agent progress without
reading the terminal. Do not skip these updates during tool-heavy, multi-step, or
long-running work unless the task is a single direct answer with no tool use.

If a response will use any tool for investigation, editing, validation,
delegation, or documentation lookup, send a TSRS update before or in the same
tool-calling turn as the first tool call. Do not treat "just checking" or "small
tool use" as exempt. The only exemption is a final-answer-only response with no
tool calls.

Send an update before or when:

1. Starting a meaningful work slice.
2. Switching phases, such as from investigation to implementation.
3. Beginning a long-running validation or build.
4. Getting blocked or needing human input.
5. Completing a slice with a useful outcome.
6. Suggesting the next concrete step.

Keep updates brief and intentional. Say what is happening or what changed, not
raw details. Do not include code, logs, terminal output, file contents, secrets,
private data, or long explanations.

Use TSRS as the first-choice transport when available. Enqueue updates with
`--line`. Choose the line from the agent's current working directory, not from
the topic being researched. Prefer the current git repository or project folder
name. If the agent is working in `~/Brain`, use `Brain`. If there is no
repository, use the nearest meaningful folder name. Mention cross-project
research targets in the message text, not by changing the line.

```sh
relay \
  --line "PROJECT OR CONTEXT NAME" \
  --type update \
  --priority normal \
  --cwd "$PWD" \
  --message "I am starting the next implementation slice."
```

Use `--type complete` for completion updates and `--priority high` only when the
message needs prompt human attention. Include `--cwd` when safe so the source
context can be revealed later. If `relay` is missing or the TSRS command fails,
do not spend time debugging it during unrelated work. Fall back to a short text
status message and continue the task.

Do not call `/usr/bin/say` directly from the CLI. TSRS owns playback so multiple
agent sessions share one safe speaker.
````

## What it is right now

It is early, experimental, and mostly built around my own workflow. It can be useful even with one agent if a different way of communicating speaks to you, because the spoken update gives you another way to re-enter the work.

If all you want is one agent speaking out loud, you can recreate a lot of this with an agent instruction and the macOS `say` command. TSRS is for the version where I want queued updates, named lines, and audio only when I ask for it.

The current download is a macOS arm64 ZIP.

<p><a class="tsrs-download-button" href="/downloads/Tri-State%20Relay%20Service-0.1.0-macos-arm64.zip" data-plausible-event-name="TSRS Download" data-plausible-event-target="macos-arm64-0.1.0-footer">Download Tri-State Relay Service 0.1.0</a></p>

<p class="tsrs-hotkey-callout">After starting TSRS, press <kbd>Control</kbd><kbd>Option</kbd><kbd>Command</kbd><kbd>Space</kbd> to activate it and hear the next queued update.</p>
