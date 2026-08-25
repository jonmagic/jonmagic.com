---
title: A few small Tri-State Relay Service improvements
date: 2026-08-25
tags:
  - post
description: >-
  Tri-State Relay Service 2.3.0 adds configurable playback boost, plus a few recent reliability improvements that have made the local agent relay more useful day to day.
featured: 1
new: true
accent: blue
---

I just released a new version of [Tri-State Relay Service](/tsrs/) with a few small improvements that have made it even more helpful for my day-to-day usage.

The biggest one is a playback boost for generated voices. I have some voices I like, but a few were quiet enough that I would miss updates even with my Mac volume all the way up. TSRS can now add between 0 and 12 dB of gain before it plays generated audio, with a limiter so the louder voices do not get wrecked in the process.

I set the default to 6 dB, which has been enough for me so far. There is a compact slider in Settings > Voice when I want to adjust it from the menu bar app, and I can change it from the terminal too.

```sh
relay config set --playback-gain-db 9.5
```

The setting also lives in `config.toml`, which is useful when I am setting up a new machine or want to keep the exact configuration in one place.

```toml
[voice]
gain_db = 9.5
```

> [!NOTE]
> I build two to four little productivity improvements most weeks, and most of them do not last very long. They solve whatever was annoying me that day, then I move on and forget they exist. TSRS has been around for months now, and I keep making it better because I keep using it. That is a much bigger signal to me than whether any single feature feels exciting.

## The boring improvements are the ones I notice

The playback boost is in [Tri-State Relay Service 2.3.0](https://github.com/jonmagic/tri-state-relay-service/releases/tag/v2.3.0), but I have also been making a few reliability improvements over the last couple of releases.

TSRS can recover when a voice provider or playback process gets stuck, instead of leaving the app thinking it is still speaking. `relay ff` lets me skip a backlog without deleting its history. New lines can also keep stable voice assignments, so I do not have to relearn which voice belongs to which project after I add something new.

None of this changes the basic rule I care about. Agents can leave me updates, but the app decides when audio plays. Focus, Ready, Live, and Mute still work the same way. The command-line tool can ask the app to queue something, but it cannot start talking over whatever I am doing.

I have been using Live mode more lately when I am already sitting at my desk and want to hear work moving. The different line voices help me know which project is talking, and the playback boost means I can actually hear the quieter ones.

That is a small thing, but it has made TSRS more useful for me.

[Tri-State Relay Service 2.3.0 is available as a signed macOS download.](https://github.com/jonmagic/tri-state-relay-service/releases/tag/v2.3.0)
