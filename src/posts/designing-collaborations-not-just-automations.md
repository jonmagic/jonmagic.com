---
layout: layout
title: Designing Collaborations, Not Just Automations
date: 2025-09-01T00:00:00.000Z
avatar: /images/posts/designing-collaborations-not-just-automations/jonmagic-contemplating-collaborations.webp
tags:
  - post
description: >-
  How the blind pursuit of automation can distract from the more important goal of building understanding and how designing collaborations may be the future of coding careers.
---

In my last post, [*The Uncertain Future of Coding Careers (and Why I'm Still Hopeful)*](https://jonmagic.com/posts/the-uncertain-future-of-coding-careers-and-why-im-still-hopeful/), I wrote about something I've always found exciting as a developer: working myself out of a job so I can work myself into the next one. I don't come from a CS background and my programming journey has always been focused on solving problems that matter to me, and that often means automating away the tedious parts of my work.

The pattern has been consistent: every time I automate away repetitive work, new challenges appear upstream. And the upstream work is often more interesting, more impactful, and more human.

This sequel is about how I'm seeing that play out in real time. It's a story about reflection, the hidden purpose of seemingly tedious tasks, and the surprising power of **designing collaborations**, not just automations.

![jonmagic contemplating collaborations](/images/posts/designing-collaborations-not-just-automations/jonmagic-contemplating-collaborations.webp)

## When Automation Delays Understanding

For almost a year, I tried every possible way to automate my weekly writeup to leadership (at GitHub we refer to these as snippets): pasting prompts into [Copilot](https://github.com/copilot), [building agentic workflows](https://gist.github.com/jonmagic/83445be775791b7d3a5cc6c97641dc57), trying out yet-to-be-released tools my coworkers are building, you name it I tried it. And every time I ran into the same problems:

**The output was terrible.** It was verbose, inconsistent, or just plain wrong. I spent almost as much time fixing the results as I would have spent writing them myself.

But more importantly, **I wasn't learning anything.** Snippets became a chore. I wasn't reflecting, I wasn't seeing patterns in my work, I wasn't building understanding of what mattered. It was just another TPS report—faster busywork, not better outcomes.

Here's what took me too long to realize: writing snippets wasn't just about informing leadership. The act of reflection—forcing myself to review the week, identify what worked, process what I learned—was building understanding in my own mind. When I automated that away, I lost something valuable: the cognitive work that made me better at my job.

This applies beyond snippets. Code reviews aren't just about catching bugs—they're about building shared understanding of the codebase. Documentation isn't just about recording information—it's about clarifying your own thinking. Even debugging isn't just about fixing problems—it's about building mental models of how systems work.

**Not all tasks exist to produce an output. Some exist to build understanding.** Automating those defeats the whole purpose.

## The Breakthrough: Preserve Learning, Reduce Grunt Work

Two things shifted my approach:

1. **A self-reflection habit.** In my weekly "how I work" review, I noticed my best outcomes always came from collaboration—pairing with teammates, debating with peers, even bouncing ideas off Copilot. Collaboration, human or AI, was where the wins came from.

2. **Discovering VS Code Chat Modes.** [Chat Modes](https://code.visualstudio.com/docs/copilot/customization/custom-chat-modes) gave me a way to design a lightweight, *context-specific collaborator* in seconds. Instead of trying to build a [complex multi-step agentic workflow](https://gist.github.com/jonmagic/83445be775791b7d3a5cc6c97641dc57), I could create an AI partner with a few paragraphs of instructions.

The key question became: **"What am I supposed to learn from doing this?"** If the answer was "nothing," automate away. If the answer was meaningful, design a collaboration that preserves the learning while reducing the grunt work.

The result was my [**Snippets Interviewer Chat Mode**](https://gist.github.com/jonmagic/bdb9ce0d706ed31c427cd1c13e2e285a). Instead of only collecting context and generating near final output in one go, it asks me questions, checks sources, and lets me edit and interject. Most importantly, **it helps me think** about what I did that week by turning it into a conversation.

When I automated the task I regained 30-45 minutes of time but **the meaning disappeared**. When I designed a collaboration, **both efficiency and understanding remained**.

## Why This Matters Beyond Individual Tasks

The future of coding careers isn't about doing tasks faster—it's about **designing better collaborations** that preserve what humans need while eliminating what we don't.

I've been seeing this pattern emerge:

* **Automation replaces execution.** Once we know exactly what needs doing, machines can do it faster and cheaper.
* **Collaboration enhances exploration and understanding.** When problems are ambiguous, when we need to learn, when we don't even know what questions to ask yet, collaboration is where value is created.

This insight is a fundamental career principle. The more you move upstream into framing, guiding, and curating—the work that builds understanding—the less replaceable you become.

And it scales beyond individual work. I've started creating Chat Modes for my team, like [this one that helps us upgrade project documentation](https://gist.github.com/jonmagic/357ca10264ac198c95d68a0203c6b1f4). It turns a solo documentation task into a collaborative process where the improved docs help new teammates onboard faster and old teammates reload context with less effort. As I wrote in [Context Rules Everything Around Me](https://jonmagic.com/posts/context-rules-everything-around-me/), context creates the foundation for more effective AI collaboration.

## What AI Still Can't Do

In conversations with friends (and with ChatGPT itself, ironically), I keep coming back to a nagging question: can we ever teach machines to truly explore? To intuit? To decide what's worth understanding?

Right now, the answer is no. LLMs are incredible at predicting what comes next, but not at deciding what *ought* to come next. They don't have goals. They don't want anything. They don't care.

That means exploration, venturing into the unknown, choosing what's worth solving, building understanding through reflection—that's still ours. And that's good news, because exploration and understanding are the most rewarding parts of the job.

My snippets Chat Mode is a perfect example. The AI can search, summarize, and draft. But only I can decide which risks matter, which collaborations deserve a shoutout, which themes are worth elevating. That's exploration. That's understanding. That's me.

## Climbing the Abstraction Ladder

I'm thinking about this as an abstraction ladder where each rung preserves human understanding while eliminating mechanical work:

* A generation ago, debugging memory management was a big part of coding.
* Then we moved up to writing applications without worrying about memory.
* Now we're moving up again: coding with AI pair programmers that handle boilerplate, syntax, even architecture patterns.

If your career is tied to a specific rung, the ladder can feel scary. But if your career is tied to *climbing the ladder itself*—to curiosity, adaptability, and upstream thinking—you're better positioned for whatever comes next.

The skill that endures isn't "knowing X language" or "mastering Y framework." It's: **designing collaborations that preserve understanding while eliminating busywork.** Every new collaboration we design creates value that's harder to automate away because it amplifies human insight rather than replacing it.

## New Metrics of Accomplishment

Something unexpected happened when I redesigned snippets around collaboration: the *purpose* of snippets changed.

* Before, snippets were proof of activity. A list of what I did.
* Now, snippets are a reflection. A mirror of what mattered, a record of collaboration, and a chance to give credit.

By shifting from automation to collaboration, I didn't just make snippets faster—I made them more meaningful. I came away not with a report, but with insights, gratitude, and perspective.

I think this previews what's ahead for all of us. As AI accelerates execution, the real measure of accomplishment won't be "how much we did" but "how well we understood, framed, collaborated, and explored."

## So What's Next?

If automation keeps marching forward, and it will, what kind of work should we focus on?

Here's my short list—all work that builds understanding:

* **Framing problems**: defining what to solve is harder than solving it.
* **Exploring ambiguity**: the messy, undefined spaces where understanding emerges.
* **Curating judgment**: knowing which answers are right, safe, ethical, or impactful.
* **Designing collaborations**: building processes (with humans and AIs) that preserve learning while reducing grunt work.
* **Recognizing others**: amplifying collaboration, giving credit, building trust.

If you're looking for a career compass in uncertain times, ask yourself: "What am I supposed to learn from this work?" Then design collaborations that preserve that learning.

## Conclusion

When I look back on my first experiments with automating snippets, I see the broader automation trap. I thought the goal was to make the task disappear. But when the task disappeared, so did the meaning—and the understanding it was supposed to build.

The breakthrough came from reframing the question. Not "How do I automate this?" but **"How do I design a collaboration that preserves what I need to learn while eliminating what I don't?"**

That's the bigger lesson for coding careers in the age of AI. The robots aren't replacing us anytime soon. They'll get smarter, they'll remix our work, they'll even surprise us. But the frontier of exploration, understanding, and meaningful collaboration is still ours.

If you want to thrive in that future, don't just automate—collaborate. Design partnerships that make you smarter, more reflective, and more human, not just faster.
