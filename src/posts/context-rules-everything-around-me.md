---
title: Context Rules Everything Around Me
date: 2025-07-16
tags:
  - post
description: >-
  Capture once, reuse everywhere. I record meetings, auto-transcribe, then feed transcripts to AI prompts for summaries, action lists, and architecture drafts. Context Rules Everything Around Me.
featured: 1
---

I was drowning in meetings, losing track of decisions, and manually typing notes I never revisited. Then I found a better way—capture once, reuse everywhere with AI. In this post, I’ll show how I record and transcribe meetings, feed transcripts to large language models, and generate immediate action lists, summaries, and architecture drafts. It transformed my workflow from frantic note-taking to an effortless *meeting superpower*.


> [!NOTE]
> **TL;DR**
> - I record nearly every meeting call (or use my phone’s Voice Memos for in-person).
> - I use Zoom's built-in transcript (or Voice Memos and sometimes MacWhisper).
> - I run a simple script that prompts an LLM to produce summaries, decision logs, or whatever artifacts I need.
> - In my experience, meeting clarity shot up, and my weekly status prep time fell by about 80%.
> - See below for the minimal reproducible "transcript→prompt→artifact" stack you can try this weekend.

## Too Many Meetings, Too Little Clarity

Last last year, I moved into a principal engineer role at GitHub, and my meeting load tripled almost overnight. I was juggling dozens of syncs, architecture reviews, async updates, and 1:1s every week. I’d leave a call with a few scribbled bullet points, but promptly forget half of the decisions by the next day. The bigger my scope became, the less my scattered note-taking kept me afloat.

I realized that if I wanted to stay on top of critical decisions—let alone communicate them to peers and leadership—I needed a better system. Enter full transcripts. Once I started capturing entire conversations verbatim, it finally "clicked" that I could feed this raw context into AI to produce highlights and next steps. The difference was night and day.

## Why Transcripts? The Breakthrough

I initially tried built-in "auto-summaries" from meeting software, but they were half-baked or missed nuance because the prompts sucked and they lacked good speaker attributions. Then I discovered the Zoom accessibility transcript option on calls: a text feed with speaker labels that I could save manually. Suddenly, I had an accurate record of "who said what," ready to pipe into an LLM. This overcame the usual "notes are incomplete" feeling and let me be fully present in meetings rather than trying to type everything I heard.

![zoom transcript](/images/posts/context-rules-everything-around-me/zoom-transcript.gif)

For in-person offsites, I used my phone’s Voice Memos to capture audio. I’d import these recordings into the MacWhisper app, which automatically transcribed and even attempted speaker detection. Although I’d sometimes need to tag speakers manually, the payoff was huge: every stray comment or subtle nuance was preserved.

With these transcripts, a quick AI pass yielded exactly the details I needed:

- A bullet-pointed to-do list with owners.
- A short summary for my manager’s weekly update.
- A "what we decided" snippet for reference in a follow-up doc.

Before transcripts, I’d scramble to reconstruct these details by memory or rummage through half-finished notes. Now it’s one prompt away.

## Proof: Fewer "Did We Decide That?" Moments

After a few weeks of using transcripts in all my calls, I noticed:

- I was participating in meetings instead of just taking notes.
- My personal "action item capture rate" soared—I rarely missed tasks assigned in a meeting.
- I got ~4x more context out of the same meeting time because I could always re-check the transcript.
- My writing speed for proposals and status updates skyrocketed, saving me up to 80% of the typical prep time.

Best of all, the entire team benefited. Fewer "Wait, I thought we agreed on something else" rewinds. Less chat message churn. I even started copying my executive summaries to meeting participants within seconds of a call being done, which drastically reduced random pings for clarifications.

One anecdote stands out: during a three day offsite, I recorded 24 hours of brainstorming with Voice Memos, then fed them into a speech-to-text model. I posted a daily summary to keep everyone aligned. After the offsite, I produced a single, cohesive doc capturing all decisions, complete with quotes and proposals. That doc ended up steering part of our next quarter’s roadmap—something that wouldn’t have been possible if we’d relied on my scribbles alone.

> "This is fantastic @jonmagic - the quality of the executive summary is suprisingly high! Going to use the heck out of this 🙇🏼"
>
> "This is soooooo good. I'm going to have to play with this. I've also started to move much faster and by the end of the week, I will reflect on discussions I've had and not remember who they were with "Where did I hear this? Didn't they say...?" Thank you @jonmagic."

## The Minimal Reproducible Stack

Below is the core technology and workflow I suggest trying. It’s easy to set up on a weekend, and you’ll see immediate results.

1. **Capture**
   - Use Zoom or Teams recordings, making sure you enable transcripts (see gif above). **IMPORTANT:** Get into the habit of hitting that Trascript button as soon as you join a meeting and for Zoom [use an AppleScript like this](https://gist.github.com/jonmagic/a9ebeb20d7cdf94923533e0f59ad188e) to ensure the Save transcript button is clicked once a minute.
   - For in-person: use your phone’s Voice Memos or any handheld recorder.

2. **Transcribe**
   - For voice recordings Voice Memos is great and will generate a transcription for you if the recording isn't too long.
   - If you prefer a desktop app, tools like [MacWhisper.cpp](https://goodsnooze.gumroad.com/l/macwhisper) add speaker detection automatically.

3. **Prompt**
   - Feed your transcript into an LLM with a prompt. I use https://github.com/copilot.
   - That prompt might produce an "executive summary" or an "action item list," depending on which prompt file you pick. See [my repository of prompts](https://github.com/jonmagic/prompts).

4. **Outputs**
   - Store the final summary in Markdown (version-control it if you want an audit trail).
   - Share or link it to relevant tasks, tickets, or Slack for easy reference.

## Advanced Moves

Once you see how transcripts supercharge your summaries, you can apply the same method to almost any context. Here are a few extra ideas:

1. **24h Offsites → Daily Digest**
   Record every big whiteboard conversation. Each evening, generate a summary to keep everyone aligned, saving hours of recap or rewriting.

2. **Walking Voice Interview → Architecture Draft**
   Set your phone recording while you talk through an architecture with yourself or a teammate. Feed the transcript into an LLM that outputs a C4 model skeleton for your docs.
   ![walk and record](/images/posts/context-rules-everything-around-me/walk-and-record.webp)

3. **Link Summaries to Tickets**
   If you track tasks in GitHub Issues or JIRA, auto-create or update issues with the relevant "decisions" or "action items" from the meeting summary. Never forget a follow-up again.

4. **Searchable Transcript Corpus**
   Let’s say you have months of transcripts. Grab a search tool (with local embeddings, if you’d like) to find specific terms (e.g., "unresolved," "API limit," "compliance risk"). You can quickly see who promised what or which tasks are still open.

> [!NOTE]
> Check out the scripts I use every day at [jonmagic/scripts](https://github.com/jonmagic/scripts). For example I have an alias to `bin/fetch-github-conversation` (`fgc`) and `llm -f /path/to/executive-summary.md` (`execsum`) and run `fgc <url> | execsum` dozens of times a day to get executive summaries of conversations on GitHub.

## Privacy & Consent

Always check local rules and company policy before recording. In some regions, it’s mandatory to disclose or request consent from all participants. Data security is crucial: if transcripts contain sensitive or personal information, encrypt them at rest and redact as needed before sending them to cloud-based LLMs. In short: be transparent, and protect confidentiality.

## Accessibility & Inclusivity

It’s not just about saving you time: transcripts help Deaf teammates, those who prefer reading over listening, or anyone dealing with multiple demands on their attention. Having a verbatim record fosters inclusive communication, especially across time zones. This is about building a team culture where everyone has equal access to context—even if they missed the meeting entirely.

## C.R.E.A.M. — Context Rules Everything Around Me

In the '90s, Wu‑Tang Clan rapped “Cash Rules Everything Around Me.” At early GitHub, **C.R.E.A.M.** was a north star for open financial ops. In 2024, my own C.R.E.A.M. stands for: **Context Rules Everything Around Me**.

Where do you go from here? Try capturing just one meeting tomorrow and feeding the transcript to your favorite LLM. If you’re already doing that, level up with advanced prompts or a record and transcribe process at an offsite. Let me know how it goes.

## Feedback

I would love ot hear from you: [discussions/8](https://github.com/jonmagic/jonmagic.com/discussions/8)

Thank you for your time :pray:
