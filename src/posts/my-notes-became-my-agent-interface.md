---
title: My Notes Became My Agent Interface
date: 2026-06-25
avatar: /images/posts/my-notes-became-my-agent-interface/panel-01.webp
tags:
  - post
description: >-
  How my Markdown notes grew into an interface for agents, and what that taught
  me about keeping useful friction while turning repeated pain into structure.
featured: 1
new: true
---

A few weeks ago I was in a Copilot CLI conversation with my Brain folder in scope, trying to make a small version of [Andrej Karpathy's LLM wiki approach](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) fit into my day. The idea made sense to me right away. Keep source material around, let agents help turn it into useful wiki pages, keep those pages maintained, and stop rebuilding context from scratch every time you sit down to work.

I thought I was going to love it, and then it didn't really stick. That isn't a knock on the idea. I still think it's a good one, and I think a lot of people should try it. What I noticed after a few attempts was more personal than that. I already had a folder tuned around how my attention, memory, and work move, and making it behave like a wiki flattened out a few differences that matter to me.

I wrote about that folder in [How I Work, 2025 Edition](/posts/how-i-work-2025-edition/), so I'm not going to re-explain the whole thing here. The short version is that I have a directory of Markdown files I call my Brain. It has weekly notes, daily project notes, meeting notes, transcripts, summaries, project notes, bookmarks, scripts, skills, and local instructions for agents. The Brain isn't a metaphor and it isn't a side project. It is the place I go when I don't trust memory enough to plan from it.

What feels different is that I don't only write to the Brain after work happens. Agents read from it while the work is still happening, and that changes what the notes need to carry.

![A warm light flowing from a Copilot CLI conversation into a folder of Markdown notes](/images/posts/my-notes-became-my-agent-interface/panel-01.webp)

## The part that didn't fit

What I liked about the LLM wiki idea was the maintenance loop. Raw material goes in, agents help synthesize it, and the system gets more useful as the pages improve. I like plain text, I like source trails, I like being able to ask an agent to update something instead of treating every task like a blank prompt, so the idea was very much aimed at the part of my brain that wants less repeated context gathering.

But when I tried it, I kept losing the signal that comes from where a note lives and what kind of note it is.

Files in `Daily Projects/` can be messy because I may only need them for the next hour. Notes in `Weekly Notes/` are partly a plan and partly a warm-up. Files in `Transcripts/` are source material. `Executive Summaries/` are synthesis. `Projects/` is where I want future-me to land when I need current state, decisions, and open questions. A script or skill is usually there because I got tired of repeating myself.

Those are small distinctions, but agents are very literal collaborators. They can search a folder full of Markdown, and they can usually find something that looks relevant, but "relevant" is not the same thing as current, safe to edit, or grounded in the source. If I don't make those differences visible, the agent has to infer them from filenames, recency, and whatever context I happened to put in the prompt.

That is where the wiki experiment helped me. It didn't convince me to replace the Brain. It helped me see that the Brain already had useful structure, but some of that structure was only obvious to me.

## Sunday night is still part of the system

One of the examples from my current workflow that keeps grounding this for me is Sunday weekly prep. These days that usually starts as a Copilot CLI conversation, and Copilot uses the Brain skill to create the next `Weekly Notes/Week of <yyyy-mm-dd>.md` file from a template. Then I open the Markdown document when I want to review the whole artifact and manually type in meetings and blocks of focus time. I could automate more of that. Calendar data is structured enough. A script could pull the week together faster than I can.

But typing it in helps me load the week into my head. I notice clusters. I notice days that are already too fragmented. I remember loose threads that need a follow-up. I start seeing which pieces of work need daily scratch space, which ones need project state updates, and which ones are mostly waiting on a conversation.

That friction teaches me something, so I keep it.

There is other friction I don't want to keep. If I have to tell an agent for the fifth time how Brain frontmatter works, that should probably become a rule or a script. If I keep correcting the same public-writing mistake, that should probably become part of the writing instructions. If a task requires an index rebuild or a source check before it is done, I don't want that living in a one-off prompt where I might forget it tomorrow.

I don't want a system that removes every rough edge. I want a system that keeps the rough edges that help me think and turns repeated noise into something more durable.

## A small map of the Brain

I don't want this table to become the spine of the post, because copying my folder names is probably the least useful part. But I do like seeing how other people arrange their working memory, so here is the rough map.

![A lived-in Brain folder map with notes, project files, transcripts, bookmarks, and AGENTS.md connected by light](/images/posts/my-notes-became-my-agent-interface/panel-02.webp)

| Area | What it holds | How it moves | Why it helps |
| --- | --- | --- | --- |
| `Daily Projects/` | Scratchpads, drafts, investigations, prep notes, active thinking | Fast, sometimes many times a day | Keeps unfinished work close to attention without pretending it is durable yet |
| `Weekly Notes/` | Planning, reflection, carryover, snippets source material | Weekly | Helps me re-enter the work and notice what changed |
| `Meeting Notes/` | Rolling notes from conversations and follow-ups | As conversations happen | Keeps decisions and context from disappearing into memory |
| `Transcripts/` | Raw transcripts from meetings or voice memos | Source material, usually append-only | Gives me something to check when a summary feels too confident |
| `Executive Summaries/` | Distilled summaries of long conversations, threads, or transcripts | After enough source exists | Turns a pile of context into something I can reuse |
| `Projects/` | Current state, decisions, risks, references, open questions | Slower, as understanding changes | Gives future-me and agents a stable place to restart |
| `Bookmarks/` | Links, docs, articles, and why I saved them | Whenever outside context matters | Keeps external memory from becoming a pile of URLs |
| Skills, scripts, and `AGENTS.md` | Repeated instructions, helper workflows, validation rules | When friction repeats | Stops me from typing the same rule into every prompt |

The table is basically a reminder to ask how the context behaves before deciding where it belongs. If it is still tied to my attention, I keep it near the messy work. If it needs to survive across weeks, I give it a more stable home. If I keep repeating the same instruction, I try to move it into the system.

That last row has been growing the most lately.

An `AGENTS.md` file is a plain local instruction file that tells agents how to work safely in a repo or folder. It can say where to start, which files matter, what not to touch, which commands validate the work, and what conventions have surprised agents before. In a notes folder it might explain which directories hold raw source, which ones hold summaries, and what kind of edits are okay. In a code repo it might explain build commands, formatting expectations, and the boundaries that should not be crossed.

> [!NOTE]
> `AGENTS.md` does not have to live only at the top of a repo. If an agent enters a nested project folder with its own `AGENTS.md`, those local instructions get added to the broader instructions the agent already had.

Skills and scripts cover the parts where I want more reuse or less guessing. A script can create the right Markdown file with the right date and frontmatter. Another script can rebuild an index or check that links still resolve. A skill can carry a workflow I use often enough that I don't want to paste the same prompt every time.

The model can still make judgment calls. I want that. I don't want to turn everything into a machine. But I do want the boring rules to live somewhere other than my short-term memory.

## Transcripts changed what I expect from notes

Another concrete change is how much more often I keep source material now. If I have a transcript from a meeting or a voice memo, I don't want the summary to replace it. I want the summary to point back to it.

![Transcript pages and voice memo waveforms flowing into summaries and project notes](/images/posts/my-notes-became-my-agent-interface/panel-03.webp)

That changes what I expect from notes. When I ask an agent to help write a project update, I want it to be able to find the summary and then check the transcript when the summary feels too confident. When I ask for a decision recap, I want the answer grounded in something more reliable than my memory of a conversation.

This is also why I care about Markdown and indexed search more than I used to. The files are plain text, so agents can read them directly. They diff cleanly. They work offline. They can be searched by the tools I already use. When a note links to the source material and follows conventions the agent understands, the note becomes an entry point instead of a dead end.

I don't think every note needs to be perfectly maintained. That would make the system too heavy and I would stop using it. But I do think the notes that agents rely on need to make their job obvious enough that a scratchpad, a transcript, and a current project note do not all look like the same kind of truth.

## The misses are useful

One unexpected thing about working with agents this way is that when they make the same kind of mistake a few times, it usually tells me something was only obvious in my head.

If an agent updates the wrong file, maybe the right file was not obvious enough. If it summarizes from a summary when it should have checked the source, maybe the source trail is too weak. If it writes something that sounds like a generic memo, maybe the writing instructions are too far away from the task. If it skips validation, maybe the validation step is documented somewhere but not where the agent is looking.

I don't want to overreact to every miss. Sometimes the model just misses. Sometimes my prompt was bad. Sometimes the task was underspecified because I hadn't done the thinking yet. But repeated misses are different. When the same thing fails a few times, I try to ask whether the system is asking me to carry a rule that should be written down.

That is the part of this that feels practical to me. The Brain is not getting more elaborate because I want a more impressive knowledge base. It is getting a little more explicit because I am collaborating with tools that need local context, source trails, and instructions they can actually see.

![Small abstract agent lights reading from organized Markdown notes while the human stays in control](/images/posts/my-notes-became-my-agent-interface/panel-04.webp)

## Start smaller than a Brain

If you're building your own system, I would not start by copying mine.

I would start with one repeated failure. Maybe decisions disappear after meetings. Maybe weekly status updates take too long because the source material is scattered. Maybe an agent keeps missing the same repo convention. Maybe you keep pasting the same prompt to start a task. Maybe you save links and then can't remember why they mattered.

Write down the last few times it happened and look for the missing artifact. It might be a note, a checklist, a short README, a local `AGENTS.md`, a tiny script, a project state file, or a habit of saving the transcript next to the summary. Make the smallest version that would have helped last time, use it for a bit, and then decide whether it reduced friction or created another obligation.

That is how my Brain has grown. It has been a long series of small repairs around the way I already think, the places my memory fails, and the instructions I got tired of repeating.

Trying the LLM wiki idea was useful because it reminded me that the goal is not to have a prettier archive. The goal is to make the work easier to re-enter while it is happening, for me and for the agents helping me.

The folders are just one implementation. I think what actually matters is noticing when context is moving too fast for your tools to see it, when something needs to survive longer than your memory, and when repeated friction is asking you to write a rule down so you don't have to carry it anymore.
