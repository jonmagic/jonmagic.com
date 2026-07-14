---
title: The Work Can Look Done Before the Thinking Is Done
date: 2026-06-30
avatar: /images/posts/the-work-can-look-done-before-the-thinking-is-done/panel-04.webp
tags:
  - post
description: >-
  Why agent-assisted work can look finished before the thinking is finished,
  and why visible reasoning needs to become part of mentoring, review, and
  execution.
accent: red
popular: true
---

I was talking with friends recently about what changes when agents become a normal part of building software.

One of them shared a story about reviewing a large agent-assisted change where the explanation was basically missing. They asked for more context, and the added description still did not answer the useful questions. Why this change? Why this approach? How did the author know it worked? What did they learn while getting there?

I think this is happening more often now because the tools can do much more than generate a few lines of code. They can produce whole features and applications from a few prompts, sometimes with barely any thought from the person asking for them.

I use agents for a lot of my work, and I think they are one of the most useful tools I have ever had. But agent-assisted work can look finished before the thinking is finished.

![A polished-looking work artifact with the hidden reasoning still unfinished underneath](/images/posts/the-work-can-look-done-before-the-thinking-is-done/panel-01.webp)

## Finished-looking work

A diff can look complete. A test suite can pass. A summary can sound polished. A plan can have numbered steps and confident wording, and all of that polish can make uncertainty harder to see.

When I write code by hand, or when I watch someone else work through a problem by hand, the struggle is usually visible somewhere. There are false starts, questions, awkward first attempts, weird edge cases, and little moments where someone realizes they had the model wrong. Some of that disappears before review, which is fine. Nobody needs to see every wrong turn.

But often the wrong turns are where the learning happened. If an agent suggested three approaches and the person accepted one, that choice matters. If the agent wrote tests that only covered the happy path, the missing validation matters. If the person kept pasting the same domain rule into the conversation, that repeated correction matters. If the final change works but the person still cannot explain why it works, that matters too.

That is the reasoning I want to make visible.

## The old learning loop had more friction

I do not want to overstate how good the old path was. A lot of teams were bad at mentoring before agents showed up. Review queues could be slow, feedback could be uneven, and "go figure it out" was often treated as a learning strategy when it was really just neglect.

Still, the good version made sense.

Someone newer to the work would pick up a smaller task, pair with someone more experienced, get stuck, ask questions, open a pull request, and get feedback. Some of the teaching happened in the diff. Some happened in a pairing session. Some happened in the conversation where the more experienced person asked why the problem needed to be solved that way in the first place.

The important part was that someone more experienced could see the thinking before it hardened into a finished artifact. Pairing made that easier. Review could still help, but by then a lot of the learning had already happened or been missed.

Agents make that weird. If a coding assistant is writing most of the code, pairing cannot just be two people staring at someone typing. It also cannot become passive watching while the agent does the thinking. The learning opportunity moves into the questions around the work, like why we asked the agent to do something, what it suggested that we rejected, what it misunderstood, what we would need to validate before trusting it, and what the person understood after the session that they did not understand before.

Pairing may be more important now, not less, but it has to move up a level. The value is helping someone notice what they are trusting before the work gets packaged as done.

![A senior and newer builder talking through agent suggestions before the work is treated as done](/images/posts/the-work-can-look-done-before-the-thinking-is-done/panel-02.webp)

## The blast radius got bigger

The same invisible-reasoning problem shows up beyond software engineers.

People who would not have called themselves software engineers a year ago can now build real tools with an agent. They can automate a workflow, connect APIs, process data, generate an internal app, and ship something that solves a real problem.

When that goes well, it is incredible. It lowers the distance between knowing the work and changing the system around the work.

But the same issue shows up there too. A person can produce a working artifact before they understand the risks, the assumptions, or the maintenance cost. They can become powerful faster than they become safe.

That does not mean we should keep the tools away from them. It means the learning loop has to change.

In the older model, smaller tasks created a kind of natural blast-radius control. Not always, and not perfectly, but often enough. The work was bounded, the review surface was visible, and the feedback loop had places where someone more experienced could intervene.

Agents let people skip across some of that bounded struggle. Sometimes that is exactly what we want. Nobody needs to spend a week fighting boilerplate if the tool can clear it away. But if the tool clears away the struggle that would have built judgment, we need to add the learning back somewhere else.

## What I want people to learn

A newer builder can ask an agent to explain a subsystem before touching it. They can compare implementation options, ask what could go wrong, ask for tests, docs, and observability, then ask the agent to summarize the conversation into a pull request description or project note and edit that summary until it matches what they actually believe.

That is the loop I want people to practice. Not "have the agent do everything" or "prove you wrote it by hand." Both of those miss the point. The point is learning how to use the agent to build understanding, then owning the artifact that comes out of that process.

If I produce something with an agent, I still own it. I own the claims, the correctness, the confidence level, and the consequences of someone else acting on it. Saying "the agent wrote this" might be transparent, but it does not make the work safer. If anything, it can shift the burden to the reader or reviewer, who now has to decide whether I understood what I handed them.

I think the better norm is simple. If the reasoning matters, make enough of it visible for someone else to review.

Not all of it. Not a transcript dump. Just enough to explain why the change exists, name the options you considered, say what validation you trust, show what you learned, and point at what the next person should not have to rediscover.

![A pull request description showing the choices, validation, and remaining uncertainty behind the change](/images/posts/the-work-can-look-done-before-the-thinking-is-done/panel-03.webp)

## A small example

The weak version of a description says:

> Updates the data import flow to use the new API.

That might be true, but it does not show any reasoning. It makes the reviewer reconstruct the work from the diff.

The useful version says something more like:

> This moves the data import flow to the new API because the old endpoint does not include the fields we need for reconciliation. I asked the agent for two options, a thin adapter around the old flow and a new importer. I chose the adapter because it keeps the existing retry behavior and gives us a smaller rollback. I validated it with the existing import tests, one new failure case for missing IDs, and a manual run against a fixture. The part I am least sure about is whether the fixture covers duplicate records, so I called that out as follow-up.

That is not a dissertation. It is just enough reasoning to review.

It gives the reviewer a better place to push. Maybe the adapter is wrong. Maybe the validation is thin. Maybe duplicate records are not follow-up and need to be handled now. Good. That is the conversation we should be having.

## Pairing is becoming a conversation first

A lot of my pairing lately does not look like two people writing code together.

Sometimes we look at code, UIs, workflows, screenshots, docs, or a failing test, and that is useful. But more often the valuable part is the conversation. Someone talks through what they are trying to do, where they are stuck, what the agent suggested, what they do not trust yet, and what they think the next move should be.

That conversation becomes an artifact. We capture a transcript. Sometimes we capture screenshots, links, or the rough outline of an ADR. Then those artifacts go back into the work, usually with agents helping turn the reasoning into code, tests, docs, or a proposal.

That is a different kind of pairing. The value is not watching every keystroke. The value is helping someone find the questions worth asking before the work looks done.

I know not everyone wants to pair. Some people think better asynchronously. Some teams are distributed enough that pairing is hard to schedule. Some work is better reviewed after someone has had time alone with it.

That is all fine. I do not think pairing has to be the only learning path, but I am starting to think ad-hoc pairing may matter more than recurring pairing for this kind of work. A recurring pair can build trust and shared context, which still matters. But an ad-hoc pair can tighten the feedback loop right when someone needs to talk something out. Instead of waiting for review after the artifact is polished, you get into the reasoning while it is still soft enough to change.

![An ad-hoc pairing conversation turning into notes, tests, docs, and a clearer implementation](/images/posts/the-work-can-look-done-before-the-thinking-is-done/panel-04.webp)

## What seniors and reviewers need to change

People with more experience need to adjust too. It is not enough for me to be good at using agents myself. It is not enough to leave review comments after the work looks done. If I want people around me to grow, I need to spend more time on the invisible parts of the work. I need to ask how they got to the result, what they tried and rejected, what they validated themselves, and what they understand now that they did not understand before.

Sometimes I need to pair too, not to take over the keyboard, but to help them notice the questions worth asking while the agent is still moving. That will feel slower, in the same way writing tests is slower, or writing down a runbook is slower, or mentoring someone through the first version of a project is slower. It slows down the moment so the next moment is less fragile.

## The incentives have to change too

There is a structural problem underneath all of this, and I do not think it is a tooling problem.

A lot of our systems still reward the finished artifact more than the thinking that made it safe. We count shipped work, merged pull requests, completed projects, and visible output. Those things matter, but they do not always show whether someone developed better judgment, preserved context for the next person, or helped the team avoid repeating the same mistake later.

That gets harder with agents because the output can arrive so quickly. If the only thing we reward is the finished thing, people will naturally optimize for more finished things. They will have less reason to slow down, pair, write down the tradeoffs, improve the instructions, or turn a messy conversation into something the next person can reuse.

I think that has to change. If visible reasoning matters, then visible reasoning has to count as part of the work. Mentoring someone through an agent-assisted project, helping a non-engineer turn research into an ADR before code exists, and turning repeated questions into better docs, scripts, tests, or local instructions all need to count too.

Otherwise we are asking people to do the slower thing that makes the whole system better while rewarding them for the faster thing that makes their own output easier to measure. Changing those incentives is what separates teams that get faster from teams that actually get better.

## The work is not only the output

The teams that get this right will not be the teams with the most generated code or the most automated workflows. They will be the teams that get better every time the tool exposes a missing piece of understanding.

The success story I want is someone who might not have called themselves a software engineer a year ago using agents to do the research before the code exists. They write down the architecture and tradeoffs. They turn that into an ADR or proposal that software engineering teams and other stakeholders can react to. Then, once the thinking has gotten feedback, they use an agent to help execute.

That is the version that feels exciting to me. Not because the agent wrote the code, but because the person learned how to make the reasoning visible before the code existed.

That person asks better questions. Why this change? Why this approach? How do we know it works? What did we learn while getting there? What should the next person not have to rediscover?

![Visible reasoning compounding into better judgment instead of only more generated output](/images/posts/the-work-can-look-done-before-the-thinking-is-done/panel-05.webp)

Not because I want more process. Because I want the speed to compound into understanding instead of quietly spending it.
