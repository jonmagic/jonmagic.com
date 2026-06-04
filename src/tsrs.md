---
layout: layout
title: Tri-State Relay Service
description: >-
  A small macOS app for hearing short agent updates that make it easier to
  re-enter the work, inspired by a family AI coding project.
permalink: /tsrs/
---

<section class="tsrs-hero">
  <img class="tsrs-icon" src="/images/tsrs/AppIcon.png" alt="Tri-State Relay Service app icon" width="160" height="160">
  <div class="tsrs-hero-copy">
    <p class="tsrs-kicker">A local macOS relay for agent updates</p>
    <p class="tsrs-deck">Short audio updates make agent work easier to re-enter without watching every terminal.</p>
    <a class="tsrs-download-button" href="/downloads/Tri-State%20Relay%20Service.zip" data-plausible-event-name="TSRS Download" data-plausible-event-target="macos-latest">Download for macOS</a>
  </div>
</section>

## It started with a game

I started building this while helping my 8yo make their own game with AI.

Voice input made the collaboration feel possible in a way typing did not. They could speak to an agent like Copilot or Claude and stay in the flow of describing the game they wanted to make. That solved half of the loop.

The other half was feedback.

They needed the agent to speak back in short [ELI5](https://simple.wikipedia.org/wiki/ELI5) updates. Not terminal output. Not a long explanation. Just enough audio to know work was starting, something had changed, or a step was ready for them to try.

The first version was not an app. It was a project-level agent instruction that told the agent when to speak and how short to keep it.

## The missing feedback loop

That pattern worked because the updates were intentional. The agent did not narrate every command or read a transcript of its terminal output. It said something useful before a work slice, at key checkpoints, when blocked, and when something was ready for feedback or user testing.

After about an hour of using it together, I noticed it helped me too.

**Audio triggered a different part of my brain than text on a screen. It made the agent's state easier to re-enter.** That connected to a problem I kept running into with my own work, where I might have multiple agents running but I can only focus on one project at a time.

The important part is not just that the message is audio. It is that the audio arrives when I ask for it, from the line I am ready to hear, without turning every agent into a noisy interruption machine.

## What relay does

Tri-State Relay Service is a local macOS toolbar app and CLI for brief agent status updates.

Agents send short, intentional updates to a local relay queue. Each project or context gets a line. The app stays quiet by default while I am focused. When I am ready to switch context, I use the hotkey to hear the next useful update and move to that line.

> [!NOTE]
> The tri-state idea is quiet, waiting, active. A line can stay silent while I am focused, hold an update for later, then become the thing I am listening to when I choose to switch context.

The goal is audio feedback on demand, not constant interruption.

## Add it to your agent instructions

Paste this into your agent instructions if you want agents to send updates to the app. Setup can install the `relay` command for you.

<button class="tsrs-copy-button" type="button" data-copy-next-code>Copy instructions</button>

````md
## Relay updates

Use short relay updates so I can follow agent progress without
reading the terminal. Do not skip these updates during tool-heavy, multi-step, or
long-running work unless the task is a single direct answer with no tool use.

If a response will use any tool for investigation, editing, validation,
delegation, or documentation lookup, send a relay update before or in the same
tool-calling turn as the first tool call. Do not treat "just checking" or "small
tool use" as exempt. The only exemption is a final-answer-only response with no
tool calls.

Send an update before or when one of these things happens.

1. Starting a meaningful work slice.
2. Switching phases, such as from investigation to implementation.
3. Beginning a long-running validation or build.
4. Getting blocked or needing human input.
5. Completing a slice with a useful outcome.
6. Suggesting the next concrete step.

Keep updates brief and intentional. Say what is happening or what changed, not
raw details. Do not include code, logs, terminal output, file contents, secrets,
private data, or long explanations.

Use the relay command as the first-choice transport when available. Enqueue updates with
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
context can be revealed later. If `relay` is missing or the command fails,
do not spend time debugging it during unrelated work. Fall back to a short text
status message and continue the task.

Do not call `/usr/bin/say` directly from the CLI. The app owns playback so multiple
agent sessions share one safe speaker.
````

## User guide

The app is a quiet local inbox for updates from your coding agents. Instead of leaving every agent to interrupt you in its own way, agents send short relays to the macOS menu bar app. You stay in control of when one is played.

The basic idea is simple.

1. Install the app and the `relay` command.
2. Tell your agents when to send short status updates.
3. Let relays queue quietly while you work.
4. Press Play Next when you are ready to hear one.

### Start with the app

Launch the macOS app bundle. On first launch, Settings opens automatically and walks you through the essentials.

The first thing to set up is the command-line tool. The app can install or refresh the `relay` command for you at this location.

```text
/usr/local/bin/relay
```

Use the Settings install button and the app will handle the copy for you. If you would rather not install a copy, Settings can also show the full bundled app path so you can paste that into agent instructions instead.

After the CLI step, choose a keyboard shortcut and decide whether the app should open at login. The default shortcut is `Control` + `Option` + `Command` + `Space`. You can change it by clicking the shortcut button and pressing the combination you want. Open at Login is optional and starts in Focus mode, so relays still queue quietly until you ask to hear one.

Setup stays quiet. Anything that arrives is queued until you choose to hear it.

<p><a class="tsrs-download-button" href="/downloads/Tri-State%20Relay%20Service.zip" data-plausible-event-name="TSRS Download" data-plausible-event-target="macos-latest-footer">Download Tri-State Relay Service</a></p>

### Your first relay

A relay is a short, human-readable update from an agent. It should sound like a teammate briefly saying what changed, not like a log dump.

For example.

```sh
relay --line "My Project" --message "I’m starting the next implementation slice."
```

When that command runs, the update appears in the app. If you are in Focus mode, it waits silently. When you are ready, use Play Next from the menu bar app or run this command.

```sh
relay ready
```

The app plays one eligible relay, then returns to quiet mode.

### What makes a good relay

Good relays are short and intentional. Use them for moments like these.

1. Starting a meaningful work slice.
2. Switching phases, such as from investigation to implementation.
3. Getting blocked or needing human input.
4. Finishing something useful.

Avoid sending raw command output, logs, code, secrets, private data, or long explanations. If the message would be annoying to hear out loud, it is probably too much for a relay.

Good examples.

```sh
relay --line "My Project" --type update --message "The tests are running now."
relay --line "My Project" --type complete --message "The draft is ready to review."
relay --line "My Project" --priority high --message "I’m blocked and need your choice before continuing."
```

### Lines keep work streams separate

A line is a named work stream. If you only have one agent working on one project, one line may be enough. If you have several agents working at once, lines make it much easier to understand which update belongs where.

For example, you might use these commands.

```sh
relay --line "Website" --message "I found the broken image path."
relay --line "API" --message "The auth test failure is isolated."
```

You can also use more specific line names when several agents are working inside the same project.

```sh
relay --line "App icon" --message "The app icon was rebuilt."
relay --line "User guide" --message "The user guide rewrite is in progress."
```

The active line is the line the app plays from automatically when you ask for the next relay. Other lines stay queued until you switch to them or pull from them directly.

Useful line commands.

```sh
relay line
relay line "Website"
relay list
```

### Add it to your agent instructions

The easiest way to make it useful is to add a small instruction to your highest-level agent instructions. Put it wherever your coding agent reads its global or project instructions.

Start simple.

```text
When using tools or doing multi-step work, send short relay updates with this command.

relay --line "My Project" --type update --priority normal --cwd "$PWD" --message "I’m starting the next work slice."

Use --type complete when a meaningful task is done. Keep messages brief and human-authored. Do not send code, logs, secrets, private data, or raw terminal output.
```

If you often run more than one agent in the same project, ask the agent to choose or confirm a line name at the start of the session. That gives each work stream a separate lane without changing projects.

Example.

```text
At the start of each session, ask me what the relay line should be called. An empty answer is fine and means to use the current project or folder name. Use that line for all updates during the session.
```

You can combine that with a default line rule.

```text
Choose the default line from the current working directory. Prefer the git repository or project name. Mention cross-project research in the message text instead of changing the line.
```

The goal is not to make agents chatty. The goal is to make their important state changes easy to notice without watching every terminal.

### Everyday controls

The app is designed to be quiet by default.

Focus mode queues relays without speaking. Ready mode releases one relay, then returns to Focus. Mute prevents playback even if relays are queued.

Common commands.

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

### Voice and shortcut settings

Open Settings whenever you want to change the CLI install, keyboard shortcut, Open at Login, or voice.

Changing the voice is quiet. Use Preview only when you explicitly want to hear a sample. To add more macOS voices, open System Settings > Accessibility > Spoken Content.

Direct-download builds use app-owned playback and can use installed macOS voices that work with the system speech engine. Natural voices are favored when available, and System Default remains available.

### When many updates pile up

When you are focused on one line, other lines may collect several updates. This stays manageable by showing or playing the latest useful update for an inactive line instead of making you hear every stale intermediate message.

For many people, the default behavior is enough. You can work on one line, then switch lines when you are ready to catch up.

### Advanced inactive-line Combiner

The Combiner is for people who want an external agent or command to summarize many queued inactive-line updates into one short relay. It is useful when you run several agents at once and want a catch-up that sounds like a concise teammate summary.

You can inspect or change the Combiner from the CLI.

```sh
relay combiner
relay combiner --command "llm prompt <input> --system <system> --no-stream --no-log"
relay combiner --command none
```

The command template receives the inactive-line updates as input and should return one safe, short message. Leave the Combiner unset if you prefer the simpler latest-update behavior.

Combiner output should follow the same rules as any other relay. No secrets, no raw logs, no code dumps, and no long explanations.

### If something does not work

If agents cannot find `relay`, open Settings and use the CLI install panel to install or refresh the command. If you did not install it, copy the bundled CLI path from Settings and use that full path in your agent instructions.

If relays queue but do not speak, check whether the app is focused, muted, or waiting because the microphone appears active. You can always use `relay list` to see what is waiting.

The local queue lives on your Mac here.

```text
~/Library/Application Support/Tri-State Relay Service/relay.db
```

You usually do not need to touch that file. It is listed here only so you know where your local queue data lives.
