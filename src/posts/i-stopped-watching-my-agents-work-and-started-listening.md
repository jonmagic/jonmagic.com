---
title: I stopped watching my agents work and started listening
date: 2026-07-07
avatar: /images/posts/i-stopped-watching-my-agents-work-and-started-listening/panel-04.webp
tags:
  - post
description: >-
  How Tri-State Relay Service grew from queued audio updates into Live mode,
  and why per-line voices make agent work easier to follow.
featured: 1
new: true
accent: violet
---

I shipped the first version of [Tri-State Relay Service](/tsrs/) (TSRS) because I needed agents to stop interrupting me.

The original problem was simple. I had figured out that [short spoken updates helped me follow agent work](/posts/the-feedback-loop-i-was-missing/) without reading a wall of terminal output, but plain [`say`](https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/SpeakText.html) calls broke down as soon as more than one agent was running. If every process can talk whenever it wants, the room gets noisy fast.

So I built a queue.

Agents leave short updates, TSRS holds them, and I hit Ready when I want to hear the next one. An agent can say "I'm done with the next step," but it does not get to decide when my room gets audio.

![A quiet TSRS-inspired relay machine waiting on a dark desk](/images/posts/i-stopped-watching-my-agents-work-and-started-listening/panel-01.webp)

## The queue solved the interruption problem

The first version of TSRS felt a lot like voicemail.

[Focus mode](/tsrs/#focus%2C-ready%2C-and-live) means nothing speaks. Ready mode means I am ready for one more update. The app plays one relay, then goes quiet again. I liked that because it put the pacing back in my hands.

Plain `say` could not do that for me. `say` is fine when one process is speaking, but it has no idea what else is happening in the room. TSRS gives the Mac app the final say over playback, so the CLI can leave a relay without interrupting me.

I still want that split. TSRS is not a notification system where every agent gets to interrupt me. It is a local relay inbox where I can hear the next useful update when I want it.

<figure>
  <video src="/images/posts/i-stopped-watching-my-agents-work-and-started-listening/demo-queue-ready.mp4" controls width="100%" preload="none" poster="/images/posts/i-stopped-watching-my-agents-work-and-started-listening/demo-queue-ready-poster.webp"></video>
  <figcaption>Focus mode keeps the room quiet. Ready releases one queued update, then TSRS goes quiet again.</figcaption>
</figure>

For a while, that was enough.

## I did not always want to press Ready again

When I talked about TSRS with a teammate, he helped me think through why listening felt different from reading.

Reading is easy to control. You decide when to read, what to skim, what to reread, and when to stop. Spoken updates are different. Once audio starts, it owns a little of your attention until it ends.

Focus and Ready worked well for that. If I am deep in a task, I do not want anything to speak unless I ask for it. But that is not the only way I use agents.

Sometimes I am sitting at my laptop with several agents running, not really typing, mostly watching them finish steps. In that mode, triggering Play Next over and over starts to feel like its own kind of busywork. I am already choosing to listen. I just do not want to babysit the queue.

So I added [Live mode](/tsrs/#focus%2C-ready%2C-and-live).

![A TSRS-inspired relay machine with several incoming agent lines converging into it](/images/posts/i-stopped-watching-my-agents-work-and-started-listening/panel-02.webp)

## Live mode is for when I am already listening

Live mode lets TSRS keep playing new updates as they arrive.

The same rules still apply. Mute wins. Focus still turns speech off. The app still groups playback by line so one noisy project does not hog the speaker. The difference is that I do not have to keep touching the queue.

Focus and Ready are voicemail. Live is closer to sitting near a small team while they call out status. Or like you are sitting at the command center at NASA or SpaceX while the engineers call out telemetry updates. You are not reading a wall of text. You hear enough to know something is happening.

With Live on, TSRS became something I could leave running while agents worked, instead of something I checked between tasks.

<figure>
  <video src="/images/posts/i-stopped-watching-my-agents-work-and-started-listening/demo-live-mode.mp4" controls width="100%" preload="none" poster="/images/posts/i-stopped-watching-my-agents-work-and-started-listening/demo-live-mode-poster.webp"></video>
  <figcaption>Live mode plays updates as they arrive, but mute still wins.</figcaption>
</figure>

After a few sessions in Live mode, I noticed the next annoyance.

## Every line sounded the same

When every line uses the same voice, I have to keep figuring out which project I am hearing.

I hear the update, then I have to parse the line name, then I have to map that back to the project in my head. It is still better than hopping between terminal windows, but it is not as good as recognizing the voice before I parse the sentence.

Humans are good at recognizing voices. I do not need someone to announce their name in every sentence when I already know what they sound like. I know who it is before I process the sentence.

Line voices were the next thing I wanted.

I do not need agents to talk more. I need the updates to be easier to recognize. If the _Brain line_ sounds different from the _Tri-State Relay Service line_, and the _Blog line_ sounds different from the _PR review line_, I can keep track without working so hard.

## I needed to know who was talking

I was not trying to make novelty voices or a bunch of agent characters. A TSRS line usually maps to a project I care about, and if I am going to hear several of them in Live mode, I should be able to recognize which one is speaking.

Right after I shared the first version of TSRS internally, people asked for audio examples. Someone imagined a "Mona" style assistant for coding work and joked that it needed a pirate voice mod. I laughed, because that would be fun, but it was not what I needed.

What I wanted was more boring and more useful. The Brain line should sound like the Brain line. The Blog line should sound like the Blog line. The PR review line should sound like PR review work. I should not have to wait for the line name before I know which project the update belongs to.

<figure>
  <video src="/images/posts/i-stopped-watching-my-agents-work-and-started-listening/demo-line-voices.mp4" controls width="100%" preload="none" poster="/images/posts/i-stopped-watching-my-agents-work-and-started-listening/demo-line-voices-poster.webp"></video>
  <figcaption>The Brain, TSRS, and Blog lines each get a voice, so the work is easier to recognize before I hear the label.</figcaption>
</figure>

[Tri-State Relay Service 2.1.0](https://github.com/jonmagic/tri-state-relay-service/releases/tag/v2.1.0) makes that possible with per-line voice IDs and a bring-your-own voice command. You choose a voice path for the app, then assign voices from that path to your lines. The default macOS voices still work locally out of the box. [Speechify](https://docs.speechify.ai/) is there as an explicit cloud option. [Kokoro](https://github.com/hexgrad/kokoro) is there if you bring your own local setup and want richer voices without sending relay text away.

> [!NOTE]
> [Kokoro](https://github.com/hexgrad/kokoro) was one of my favorite discoveries while working on this project. I was hoping there might be a way to make the line voices sound better without making every relay leave my machine, and Kokoro made that feel possible. It still asks you to bring your own local setup, and I am okay with that for a tool I am letting talk near me.

I kept the playback rules the same.

The CLI still never speaks directly. The app owns playback. Mute wins. Focus wins. Bad config fails quiet. If audio generation fails, the relay cannot get stranded pretending it is still speaking.

Those rules are why I am comfortable leaving it on. Live mode lets me hear updates as they happen, and line voices help me tell which project they came from without staring at the screen.

## Now I can leave it on

TSRS started as a way to stop agents from interrupting me.

Now it feels closer to a quiet workroom where I can tell what is happening without looking away.

The Brain line speaks up, and I know it is Brain work. The Blog line speaks up, and I know there is a draft to review. A PR review line finishes, and I know which window I probably need to check next.

For me, that is enough. I do not need my agents to have personalities. I need the audio to help me follow the work.

![Distinct colored voice lines passing through a TSRS-inspired relay machine](/images/posts/i-stopped-watching-my-agents-work-and-started-listening/panel-04.webp)
