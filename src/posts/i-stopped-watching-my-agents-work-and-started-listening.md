---
title: I stopped watching my agents work and started listening
date: 2026-07-07
avatar: /images/posts/i-stopped-watching-my-agents-work-and-started-listening/panel-04.webp
tags:
  - post
description: >-
  How Tri-State Relay Service grew from queued audio updates into Live mode,
  and why recognizable workstreams changed how I follow agent work.
featured: 1
new: true
accent: violet
---

I shipped the first version of [Tri-State Relay Service](/tsrs/) (TSRS) because I needed agents to stop interrupting me.

The original problem was simple. I had figured out that [short spoken updates helped me follow agent work](/posts/the-feedback-loop-i-was-missing/) without reading a wall of terminal output, but plain [`say`](https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/SpeakText.html) calls broke down as soon as more than one agent was running. If every process can talk whenever it wants, the room gets noisy fast.

So I built a queue.

Agents leave short updates. The app keeps them quiet. I decide when I am ready to hear one. The important part was not that agents could talk. The important part was that they could wait.

![A quiet TSRS-inspired relay machine waiting on a dark desk](/images/posts/i-stopped-watching-my-agents-work-and-started-listening/panel-01.webp)

## The queue solved the interruption problem

The first version of TSRS felt a lot like voicemail.

[Focus mode](/tsrs/#focus%2C-ready%2C-and-live) means nothing speaks. Ready mode means I am ready for one more update. The app plays one relay, then goes quiet again. That model worked because it gave the pacing back to me.

That was the piece missing from raw `say`. Audio was useful, but only if the app owned playback. The CLI could enqueue a message, but it could not decide that now was a good time to speak near me. The Mac app had to own that decision.

That boundary still matters. TSRS is not a notification system where every agent gets to interrupt me. It is a local relay inbox where I can hear the next useful update when I want it.

<figure>
  <video src="/images/posts/i-stopped-watching-my-agents-work-and-started-listening/demo-queue-ready.mp4" controls width="100%" preload="none" poster="/images/posts/i-stopped-watching-my-agents-work-and-started-listening/demo-queue-ready-poster.webp"></video>
  <figcaption>Focus mode keeps the room quiet. Ready releases one queued update, then TSRS goes quiet again.</figcaption>
</figure>

For a while, that was enough.

## "Ready for one more" was not the only mode I needed

When I talked about TSRS with a teammate, he asked the question that helped me name the tradeoff more clearly.

Reading gives you control over pace. You decide when to read, what to skim, what to reread, and when to stop. Spoken updates are different. Once someone starts talking, they own a little piece of your attention until they stop.

That is exactly why TSRS had modes.

If I am deep in a task, I do not want anything to speak unless I ask for it. That is Focus and Ready. But that is not the only way I use agents.

Sometimes I am sitting at my laptop with several agents running, not really typing, mostly watching work move. In that mode, triggering Play Next over and over starts to feel like its own kind of busywork. I am already choosing to listen. I just do not want to babysit the queue.

That is why I added [Live mode](/tsrs/#focus%2C-ready%2C-and-live).

![A TSRS-inspired relay machine with several incoming agent lines converging into it](/images/posts/i-stopped-watching-my-agents-work-and-started-listening/panel-02.webp)

## Live mode was for watching work move

Live mode lets TSRS keep playing new updates automatically.

It still keeps the app-owned safety boundary. Mute still wins. Focus still turns speech off. The app still groups playback by line so one noisy project does not starve everything else. But the feeling is different.

Focus and Ready are voicemail. Live is closer to sitting near a small team while they call out what changed. Or like you are sitting at the command center at NASA or SpaceX while the engineers call out telemetry and status updates. You are not reading a wall of text. You are not waiting for a single next update. You are watching work move.

That sounds like a small change, but it changed how I used the app. With Live on, TSRS was no longer only something I checked between tasks. It became a way to stay loosely aware while multiple agents worked.

<figure>
  <video src="/images/posts/i-stopped-watching-my-agents-work-and-started-listening/demo-live-mode.mp4" controls width="100%" preload="none" poster="/images/posts/i-stopped-watching-my-agents-work-and-started-listening/demo-live-mode-poster.webp"></video>
  <figcaption>Live mode plays updates as they arrive, but mute still wins.</figcaption>
</figure>

And that is when another problem became obvious.

## Every line sounded the same

When every line uses the same voice, my ear has to do the routing work.

I hear the update, then I have to parse the line name, then I have to map that back to the project in my head. That is still better than hopping between terminal windows, but it is not as natural as it could be.

Humans are good at recognizing voices. I do not need someone to announce their name in every sentence when I already know what they sound like. A familiar voice carries context before the words land.

That is what Live mode made me want.

I do not want the agents to talk more. I want them to be easier to place in my attention. If the _Brain line_ sounds different from the _Tri-State Relay Service line_, and the _Blog line_ sounds different from the _PR review line_, I can understand more before I have to think.

## I needed to know who was talking

That is the product feature I wanted.

Not novelty voices. Not agents pretending to be characters. A TSRS line is a workstream, and if I am going to hear several workstreams in Live mode, each one should be easy to recognize.

Right after I shared the first version of TSRS internally, people asked for audio examples. Someone imagined a "Mona" style assistant for coding work and joked that it needed a pirate voice mod. I laughed, because that is the fun version of the idea, but it is not the useful version.

The useful version is simpler. The Brain line should sound like the Brain line. The Blog line should sound like the Blog line. The PR review line should sound like PR review work. I should not have to wait for the label in the sentence before my attention knows where to put the update.

<figure>
  <video src="/images/posts/i-stopped-watching-my-agents-work-and-started-listening/demo-line-voices.mp4" controls width="100%" preload="none" poster="/images/posts/i-stopped-watching-my-agents-work-and-started-listening/demo-line-voices-poster.webp"></video>
  <figcaption>The Brain, TSRS, and Blog lines each get a voice, so the work is easier to recognize before I parse the label.</figcaption>
</figure>

[Tri-State Relay Service 2.1.0](https://github.com/jonmagic/tri-state-relay-service/releases/tag/v2.1.0) makes that possible with per-line voice IDs and a bring-your-own voice command. You choose a voice path for the app, then assign voices from that path to your lines. The default macOS voices still work locally out of the box. [Speechify](https://docs.speechify.ai/) is there as an explicit cloud option. [Kokoro](https://github.com/hexgrad/kokoro) is there if you bring your own local setup and want richer voices without sending relay text away.

> [!NOTE]
> [Kokoro](https://github.com/hexgrad/kokoro) was one of my favorite discoveries while working on this project. I was hoping there might be a way to make the line voices feel richer without making every relay leave my machine, and Kokoro made that feel possible. It still asks you to bring your own local setup, but that feels like the right tradeoff for a tool that sits this close to my attention.

The important thing is that the playback contract does not change.

The CLI still never speaks directly. The app owns playback. Mute wins. Focus wins. Bad config fails quiet. If audio generation fails, the relay cannot get stranded pretending it is still speaking.

That is what makes the feature feel safe enough to leave on. TSRS can become more expressive without becoming more demanding. Live mode keeps me aware of what changed, and line voices make that awareness easier to understand.

## Now the room makes sense

The app started as a way to stop agents from interrupting me.

Now it feels closer to a quiet room of workstreams I can recognize without looking away.

The Brain line speaks up, and I know it is Brain work. The Blog line speaks up, and I know there is a draft to review. A PR review line finishes, and I know where my attention goes next.

My agents do not need personalities. They just need to sound like the work they are doing.

![Distinct colored voice lines passing through a TSRS-inspired relay machine](/images/posts/i-stopped-watching-my-agents-work-and-started-listening/panel-04.webp)
