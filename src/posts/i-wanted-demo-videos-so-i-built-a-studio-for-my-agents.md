---
title: I wanted demo videos, so I built a studio for my agents
date: 2026-07-13
avatar: /images/posts/i-wanted-demo-videos-so-i-built-a-studio-for-my-agents/social-image.webp
tags:
  - post
description: >-
  How a few Relay demos turned into Dailies, a source-driven video studio that
  can rebuild its films and use one as footage for the next.
featured: 1
new: true
accent: amber
---

When I finished writing [I stopped watching my agents work and started listening](https://jonmagic.com/posts/i-stopped-watching-my-agents-work-and-started-listening/), I still had one problem.

The post described Focus, Ready, Live mode, and voices for different agent lines. Those ideas made more sense when I could see and hear them, and I wanted a short demo video for each section.

I could have recorded the videos by hand. I also knew what would happen. I would record one, notice the pacing was wrong, record it again, find a typo, record it again, change the post, and then have to decide whether I cared enough to record it one more time.

So I asked Copilot to help me build a way to direct the videos from source.

That little helper became [Dailies](https://github.com/jonmagic/dailies).

## The first version was an editor, a terminal, and a voice

The first Dailies scenarios were Markdown files.

One block described what should appear in an editor. Another described the commands and fixture output in a terminal. Audio cue blocks named the speaker, the text, the voice, and the generated file.

The result looked a little like this:

```text
demos/tsrs/queue.demo.md
demos/tsrs/live-mode.demo.md
demos/tsrs/line-voices.demo.md
```

Then the agent could run the same loop until the candidate was worth watching.

```sh
npm run check
npm run render:candidate -- demos/tsrs/line-voices.demo.md --provider kokoro
```

Dailies compiled a timeline, rendered a browser preview, generated the narration, captured an MP4, sampled frames, and checked the output. The terminal commands were fixture text, so making a Relay demo did not mean touching my real Relay queue.

<figure>
  <img src="/images/posts/i-wanted-demo-videos-so-i-built-a-studio-for-my-agents/source-to-output.webp" alt="A readable Dailies Markdown scenario above the editor and terminal frame rendered from it" width="100%" loading="lazy">
  <figcaption>The scenario keeps the editor text, terminal fixtures, speaker, voice, and narration together while Dailies rebuilds the candidate.</figcaption>
</figure>

The rendered cut was what I reviewed, and the source file became where the agent and I made the next round of changes.

If a command stayed on screen too long, the agent changed the timing. If a sentence sounded wrong, it changed the audio cue and regenerated the fixture. If the window chrome took up too much room, it changed the set and rendered another candidate.

I was no longer trying to describe a video to an agent and hoping it understood. The agent could read the scenario, the compiled timeline, the preview, the render manifest, and the sampled frames. The checks caught broken output, and I could focus on whether the demo was boring.

## Relay and ZShot are useful without being required

Dailies grew out of the Relay videos, and I like that the two tools still fit together.

The scenarios can stage `relay` commands, and Dailies can use the same local voice-provider boundary I built for [Tri-State Relay Service](https://github.com/jonmagic/tri-state-relay-service). But Relay is not required. The commands are fixtures by default, and the audio providers sit behind wrappers that generate files without speaking directly.

My friend [@netshade](https://github.com/netshade) built [ZShot](https://zshot-cli.com/), and Dailies will use it when it is available. For an ordinary editor, terminal, or control-room scenario, ZShot records the browser stage as an MP4. If ZShot is unavailable, Dailies falls back to a small Chrome DevTools renderer.

I can use Relay voices and ZShot capture when they are available, and someone cloning Dailies can still make a video without either one.

## Then I wanted a studio

The editor and terminal set worked for Relay, but it was obviously not going to work for every story.

I wanted some demos to show a control room. Some needed a program monitor. Some needed a browser or a full-screen video. I also wanted to bring existing footage into a production without turning Dailies into a normal video editor.

Scenes describe the story. Sets decide how the room looks. Audio cues direct narration. Media fixtures place a specific window from an MP4 into a panel.

For the video fixtures, deterministic capture mattered more than pressing play. Browser video seeking kept producing the wrong decoded frame, so the agent changed the approach. `ffmpeg` extracts the declared source window first, the timeline maps each output time to an exact image, and Chrome draws that image into the set before taking the screenshot.

<figure>
  <img src="/images/posts/i-wanted-demo-videos-so-i-built-a-studio-for-my-agents/deterministic-capture.webp" alt="A Dailies scenario becomes a JSON timeline, an exact ffmpeg frame, a Chrome set, and an MP4" width="100%" loading="lazy">
  <figcaption>Each output time maps to an extracted source frame before Chrome draws the set and Dailies captures the finished movie.</figcaption>
</figure>

Extracting the frames first is more work than dropping a `<video>` tag on the page, but the same timeline frame now asks for the same source frame every time.

The studio stayed small. There is no draggable timeline, plugin system, or pile of arbitrary tracks. The source can choose a set, theme, panel, crop, fade, caption, and final hold. So far that has been enough.

## We made Dailies direct itself

Once Dailies could play video inside a set, I wanted to see how recursive we could make it.

I asked whether a Dailies video could become the footage for the new Dailies video feature. Some real inside-Hollywood inception shit.

The agent built a five-act feature reel about how Dailies works. We rendered it, committed the MP4 as a fixture, and then created an outer production that played three windows from that film inside a studio monitor.

The first result worked. And it was also boring.

The program monitor did not have enough to look at. The story was short. The styling felt like another version of a theme I was already tired of. I told the agent it needed more Apple and Pixar polish, and asked it to try something closer to an early Macintosh.

It rebuilt the room as a System 7-inspired director's desk.

Then I pointed out that the menus were on the wrong side. The window title needed to be centered. The voices sounded robotic. The progress bar moved independently from the timer. Act II had no narration. Act III left a long stretch of dead air while the scenario source finished typing.

Each time, the agent went back to the scenario or renderer, regenerated the audio and video, sampled frames, and gave me another candidate.

Dailies started to feel like a studio during those reviews. The agent could rebuild the film over and over, and I could keep giving notes about the menus, voices, pacing, and story.

The final video is now in the [Dailies README](https://github.com/jonmagic/dailies). It shows the inner Dailies film playing inside the outer Dailies film while the source and commands remain visible beside it.

<figure>
  <video src="/images/posts/i-wanted-demo-videos-so-i-built-a-studio-for-my-agents/dailies-inception.mp4" controls width="100%" preload="none" poster="/images/posts/i-wanted-demo-videos-so-i-built-a-studio-for-my-agents/dailies-inception-poster.webp"></video>
  <figcaption>Dailies plays its own feature reel inside a System 7-inspired director's desk while building the production beside it.</figcaption>
</figure>

## Preparing it for other people was part of the fun

Once the demo felt good, I asked the agent to help me prepare the whole project for open source.

While I was focused on whether the film was any good, the agent also did a bunch of release work that I barely noticed until I looked back through the commits. Dailies ended up with 28 tests, CI, an ISC license, a cleanup command, contribution and security docs, an artifact policy, and provenance files for both showcase videos.

We reviewed the full Git history and removed material I did not want to publish. We rewrote the README around the public user journey. We figured out that GitHub only renders native video controls for an uploaded attachment URL, so I dragged the finished MP4 into an issue and gave the agent the URL it needed.

Then the agent created [github.com/jonmagic/dailies](https://github.com/jonmagic/dailies), pushed the sanitized history, watched CI, checked the public README, and kept fixing the parts that did not work the way we expected.

I was mostly paying attention to the video. By the time we published the repo, there was a real little open source project around it.

## I like being the producer

After all of that automation, my favorite part was pressing play.

No test told us the Macintosh menus were on the wrong side. The evaluator did not complain that the voices sounded robotic. The manifest had no opinion about seven seconds of dead air. Those were production notes I gave after watching the candidates.

Eventually I will consider some of those [agent misses](/posts/turning-agent-misses-into-systemic-improvements/). A Macintosh menu belongs on the left. Seven seconds of silence probably needs a reason. Once I understand what I want well enough to teach it, the agent can catch it next time and I can move on to the next thing I have not learned how to explain yet.

I wanted to decide when the film was good. I could watch a cut, notice what felt wrong, and ask for another one. The agent could take those notes back through the source, audio, renderer, and candidate checks while I stayed with the story, pacing, set, and voices.

I am not sure every post needs a video, but the next time I am writing about something that makes more sense when you can see it, I can produce one without also becoming the camera operator, editor, audio engineer, and rendering pipeline.
