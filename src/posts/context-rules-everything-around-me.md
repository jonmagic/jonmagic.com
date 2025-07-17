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
> - I use Zoom's built-in transcript (or convert a recording to a transcript using a tool like [MacWhisper](https://goodsnooze.gumroad.com/l/macwhisper)).
> - I run the transcript through an LLM (like [GitHub Copilot](https://github.com/copilot), ChatGPT, or GoogleGemini) with a prompt to produce [executive summaries](https://github.com/jonmagic/prompts/blob/main/summarize/zoom-transcript-executive-summary.md), [decision logs](https://github.com/jonmagic/prompts/blob/main/summarize/transcript-meeting-notes.md), or [whatever artifacts I need](https://github.com/jonmagic/prompts).
> - In my experience, meeting clarity shot up, and my weekly status prep time fell by about 80%.
> - See below for the minimal reproducible "transcript→prompt→artifact" stack you can try this weekend.

## Too Many Meetings, Too Little Clarity

Last last year, I moved into a principal engineer role at GitHub, and my meeting load tripled almost overnight. I was juggling dozens of syncs, architecture reviews, async updates, and 1:1s every week. I’d leave a call with a few scribbled bullet points, but promptly forget half of the decisions by the next day. The bigger my scope became, the less my scattered note-taking kept me afloat.

I realized that if I wanted to stay on top of critical decisions—let alone communicate them to peers and leadership—I needed a better system. Enter full transcripts. Once I started capturing entire conversations verbatim, it finally "clicked" that I could feed this raw context into AI to produce highlights and next steps. The difference was night and day.

## Why Transcripts? The Breakthrough

I initially tried built-in "auto-summaries" from meeting software, but they were half-baked or missed nuance because the prompts sucked and they lacked good speaker attributions. Then I discovered the Zoom accessibility transcript option on calls: a text feed with speaker labels that I could save manually. Suddenly, I had an accurate record of "who said what," ready to pipe into an LLM. This overcame the usual "notes are incomplete" feeling and let me be fully present in meetings rather than trying to type everything I heard.

![zoom transcript](/images/posts/context-rules-everything-around-me/zoom-transcript.gif)

For in-person offsites, I used my phone’s Voice Memos to capture audio. I’d import these recordings into the MacWhisper app, which automatically transcribed and even attempted speaker detection. Although I’d sometimes need to tag speakers manually, the payoff was huge: every voice or contribution or subtle nuance was preserved.

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

Some testimonials from folks who have adopted my workflows and prompts:

> "This is fantastic @jonmagic - the quality of the executive summary is suprisingly high! Going to use the heck out of this 🙇🏼"
>
> "This is soooooo good. I'm going to have to play with this. I've also started to move much faster and by the end of the week, I will reflect on discussions I've had and not remember who they were with "Where did I hear this? Didn't they say...?" Thank you @jonmagic."
>
> "h/t to @jonmagic, I’ve fully bought into using transcripts and AI summaries for meetings. While they’re not perfect and can hallucinate, they let me stay present instead of taking notes."

## The Minimal Reproducible Stack

Below is the core technology and workflow I suggest trying. It’s easy to set up on a weekend, and you’ll see immediate results.

1. **Capture**
   - Use Zoom or Teams recordings, making sure you enable transcripts (see gif above).
   - For in-person: use your phone’s Voice Memos or any handheld recorder.

   > [!IMPORTANT]
   > Get into the habit of hitting that Transcript or Record button as soon as you join a meeting and for Zoom [use an AppleScript like this](https://gist.github.com/jonmagic/a9ebeb20d7cdf94923533e0f59ad188e) to ensure the **Save transcript** button is clicked frequently so that you don't lose any of the transcript before the call ends.

2. **Transcribe**
   - Skip this step if you were able to get a transcript during the capture phase.
   - For voice recordings Voice Memos is great and will generate a transcription for you if the recording isn't too long.
   - If you prefer a desktop app, tools like [MacWhisper.cpp](https://goodsnooze.gumroad.com/l/macwhisper) add speaker detection automatically.

3. **Prompt**
   - Feed your transcript into an LLM along with the processing instructions (aka a prompt). [GitHub Copilot](https://github.com/copilot) is an excellent LLM and free (or inexpensive depending on your volume).
   - That prompt might produce an "executive summary" or an "action item list," depending on which prompt you decide to use. See [my repository of prompts](https://github.com/jonmagic/prompts) for a few options to get you started.

4. **Outputs**
   - Store the final summary as text or Markdown (version-control it if you want an audit trail).
   - Share or link it to relevant tasks, tickets, or Slack for easy reference.

*I use these steps multiple times a day from meetings to capturing ideas while taking short walks. I recorded all of the context needed for an architectural decision record the other day and from there it was just a short conversation with an LLM to put it into the ADR format.*

![walk and record](/images/posts/context-rules-everything-around-me/walk-and-record.webp)

## Advanced Moves

> [!NOTE]
> **Heads-up:** The tools below live in my [`jonmagic/scripts`](https://github.com/jonmagic/scripts) repo.
> They assume you’re comfortable cloning a repository, installing and configuring the [gh](https://cli.github.com/) cli, installing and configuring the [llm](https://llm.datasette.io/en/stable/) cli, and creating shell aliases. They’re optional, but once they click, they feel like cheating.

### `fetch-github-conversation` — one-command context vacuum
Pull an entire Issue, Pull Request, or Discussion thread (comments + diffs) to STDOUT, ready for your favorite prompt.

```bash
alias fgc="$HOME/scripts/fetch-github-conversation"

fgc https://github.com/org/repo/issues/123
```

*Why it matters* – Grabbing the full conversation (including all comments) lets the LLM reason with complete history, producing tighter summaries and reducing “what happened earlier?” churn.

### `prepare-commit` — AI-drafted commit messages

An interactive script for generating a git commit commit of your staged changes using the [semantic commit message guidelines](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716).

```bash
alias commit='~/code/jonmagic/scripts/bin/prepare-commit --commit-message-prompt-path ~/code/jonmagic/prompts/generate/commit-message.md'

commit
```

*Why it matters* – You get crisp, context-rich commit messages without the mental tax of writing them from scratch—perfect when you’re shipping ten tiny PRs a day.

### `github-conversations-research-agent` — deep-dive, cite-everything analysis

Full tutorial coming soon but in the meantime if you're curious to see an advanced agent and semantic RAG setup at work to thoroughly answer questions that require multi-turn research [check out this gist](https://gist.github.com/jonmagic/552a6df70428775c221831f2a95063bc).

## Privacy & Consent

Always check local rules and company policy before recording. In some regions, it’s mandatory to disclose or request consent from all participants. Data security is crucial: if transcripts contain sensitive or personal information, encrypt them at rest and redact as needed before sending them to cloud-based LLMs. In short: be transparent, and protect confidentiality.

## Accessibility & Inclusivity

This isn’t just about saving you time. it’s about ensuring every voice is amplified. Transcripts help teammates who are Deaf, communicate differently, or absorb information best via text. They also bridge gaps across remote, asynchronous, and time‑zone‑spread teams. making sure no one is left out.

## C.R.E.A.M. — Context Rules Everything Around Me

In the '90s, Wu‑Tang Clan rapped [Cash Rules Everything Around Me](https://www.youtube.com/watch?v=PBwAxmrE194). At early GitHub, **C.R.E.A.M.** was a north star for open financial ops. In 2024, my own C.R.E.A.M. stands for: **Context Rules Everything Around Me**.

Where do you go from here? Try capturing one meeting this week and feeding the transcript to your favorite LLM. If you’re already doing that, level up with advanced prompts or a record and transcribe process at an offsite. Let me know how it goes.

## Feedback

I would love to hear from you: [discussions/8](https://github.com/jonmagic/jonmagic.com/discussions/8)

Thank you for your time :pray:
