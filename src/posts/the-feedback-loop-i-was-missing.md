---
title: The Feedback Loop I Was Missing
date: 2026-06-04
avatar: /images/posts/the-feedback-loop-i-was-missing/banner.webp
tags:
  - post
description: >-
  How helping my daughter build a game with AI led to a better audio feedback
  loop for working with coding agents.
featured: 1
---

This last weekend I was doing my best to live in the moment and my daughter asked me if we could play Minecraft. We did for an hour or two and then, inspired by a conversation with a friend, I asked if she wanted to build her own Minecraft-like game.

She was excited about the idea so I spent a few minutes with GitHub Copilot and put together an `AGENTS.md` that had the rough draft of the milestones to build a game like, instructions to red-green-refactor, [my self-improvement loop](https://thisistheway.to/ai), and an understanding that the agent would be driven by an eight-year-old.

After setting up her computer with an agent and these instructions, things were going quite well but she kept asking me to explain what the agent was doing and every time it required input it would take her a while to turn her feedback into typed text that the agent could act on. _This constant struggle to understand the agent and respond resulted in lost attention and flow_. So we started iterating.

## Speaking with the agent

First we leveraged the [Voice mode](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/voice-input) built into agents like Copilot and Claude. This was a big win, she could press and hold the spacebar and dictate, read what was captured, and press enter to get the agent back to work. For an hour this was great, but she was getting frustrated waiting on me every time she needed the output explained.

Then I had an idea to use the [`say` CLI](https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/SpeakText.html) that ships with macOS and a set of agent instructions to drive that CLI.

> [!NOTE]
> `say "Hello, I am an agent and I am speaking to you."`


So I updated the `AGENTS.md` for the project to include the instructions below and **it worked!**

> [!TIP]
> **When using tools or doing multi-step work, speak short status updates with the macOS `say` command. Do not read logs, code, secrets, or long explanations out loud.**

That said, what it read was still pretty technical, and this reminded me of something a coworker had mentioned they were using a lot in their prompts recently, [ELI5](https://jonmagic.com/eli5/), aka explain it to me like I'm five years old. So I added this to the instructions.

> [!TIP]
> **When you speak, speak like you are explaining to a five-year-old. Use simple language and short sentences.**

We got back to work and **_the experience was incredible_**. The agent would speak to us about what it was doing, what changed, and when it needed input. She could understand the updates without me having to explain them and she could stay in the flow by using voice input to respond to the agent's requests.

## Audio triggers different brain pathways

After working like this for an hour **_I realized my brain was responding to the audio updates in a different way than it did to text on a screen_**. The audio updates made it easier for me to re-enter the agent's state and understand what was happening without having to read through a wall of text.

This is when the seed of an idea started to germinate 💡 Could a more natural feedback loop solve a problem I'd been struggling with for months? I often have multiple agents running but I can only focus on one project at a time. I was constantly hopping between agent windows to check on the status of each agent, which pulled me out of flow. _What if these simple spoken updates were queued so I could listen and react to them when I was ready?_

![Tri-State Relay Service](/images/posts/the-feedback-loop-i-was-missing/banner.webp)

The `say` version proved the shape of the feedback loop, but it was too blunt for the way I actually work. If every agent can speak whenever it wants, the room gets noisy fast. I did not want a bunch of agents interrupting me and speaking over each other. **I wanted each agent to leave a short update, and I wanted to decide when I was ready to hear it.**

## Turning `say` into Relay

That became [Tri-State Relay Service](/tsrs/), a small macOS app and CLI where agents leave short updates in a local queue instead of speaking over each other.

Each project or context gets a line. A line can stay quiet while I am focused, wait with an update, and become active when I choose to listen.

The goal is audio feedback on demand, not constant interruption.

I'm releasing it for free. I may open source it someday too, but for now I mostly want to get it into people's hands and see whether this feedback loop helps anyone else.

If you want to try it, [here is the user manual and download](/tsrs/).
