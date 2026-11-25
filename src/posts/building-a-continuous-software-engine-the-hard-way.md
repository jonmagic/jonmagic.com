---
title: Building a Continuous Software Engine the Hard Way
date: 2026-11-23
avatar: /images/posts/building-a-continuous-software-engine-the-hard-way/social.webp
tags:
  - post
description: >-
  I published Build a Continuous Software Engine after spending three weeks breaking continuous agent machines until one finally started working.
featured: 1
new: true
accent: green
further_thinking:
  - date: 2026-10-25
    title: The new set of problems for engineers to solve
    url: https://www.katelynlesse.com/blog/new-problems-for-engineers-to-solve
    author: Katelyn Lesse
    note: >-
      Katelyn maps out the systems problems waiting right past a single local engine, including stateful idle-heavy runtimes, agent identity and long-running authorization, strong sandboxed isolation against prompt injection and unpatched vulnerabilities, and tamper-proof tracing with real kill switches. My post only nods to sandboxing as future work, and hers lays out why those infrastructure and security layers are where a lot of the real engineering work lives next.
---

Earlier today a colleague asked me what happened to the autonomous agent harness I was demoing last week.

"It burned itself to the ground," I told them. "So I spent the weekend starting over."

A few minutes earlier, someone else in the room had asked what I actually mean by continuous agentic engineering, and whether it is just another name for a software factory. I have stopped calling them factories, because a factory is optimized to stamp out the same widget over and over. What I have been trying to build for the past few weeks is closer to a machine you can point at a real codebase, walk away from for 24 hours, and come back to without finding a ball of mud you no longer understand.

Getting something to simply run overnight without wedging itself has been much harder than the demos make it look. It is still early, maybe too early to tell for sure, since the newest version has only been running live for about a day. Even so, it survived its first full night across three live repositories, feels right in a way none of my earlier attempts did, and finally gave me enough clarity to publish [Build a Continuous Software Engine](https://thisistheway.to/engine) alongside the [AI-assisted engineering guide](https://thisistheway.to/ai) I published earlier this year on `thisistheway.to`. This post is the messier story behind that guide, trying over and over until I understood the machinery well enough to teach it.

*Already read this yesterday? Jump straight to the [November 24 update](#update%2C-november-24) at the bottom for how night two went.*

> [!NOTE]
> **Please note most problems do not need a continuous engine like this.** I would not use one to write a blog post, knock out a one-session feature, explore early product or UI design, or touch sensitive credentials and irreversible production changes without real sandboxing. It earns its keep on multi-day or multi-week work you can verify with tests, specs, or an existing system, like building a library or storage engine, migrating a codebase between languages or frameworks, paying down years of technical debt and disjointed docs, or hardening an existing service with edge-case tests and consistent instrumentation.

## Watching the pioneers, then jumping in

For months I had been reading and watching engineers and labs talk about long-running agent harnesses, and the whole idea kept nagging at me.

Back in December, [Geoffrey Huntley's Ralph Wiggum posts](https://ghuntley.com/ralph/) and later [everything is a ralph loop](https://ghuntley.com/loop/) got me thinking about keeping agents in a tight feedback loop instead of hand-holding every step, which showed up in [Turning Agent Misses into Systemic Improvements](/posts/turning-agent-misses-into-systemic-improvements/). Since then a wave of much deeper work has come out. Anthropic published great writeups on [effective harnesses for long-running agents](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents) and [harness design for long-running apps](https://www.anthropic.com/research/harness-design-long-running-apps), followed by their workshop [Build Agents That Run for Hours](https://www.youtube.com/watch?v=mR-WAvEPRwE) and Addy Osmani's talk on [the engineer of the future choosing what is worth doing](https://www.youtube.com/watch?v=n97BCfyFIvw). OpenAI published [Harness engineering](https://openai.com/index/harness-engineering/), and Ryan Lopopolo gave two talks, one on [building software when humans steer and agents execute](https://www.youtube.com/watch?v=am_oeAoUhew) and another on [shipping code at 70 PRs a week](https://www.youtube.com/watch?v=MFQIKbr1IEo).

At the same time, individual engineers I respect were building their own machines in the open. Justin Searls wrote about turning himself into [a meat proxy](https://justin.searls.co/posts/im-just-a-meat-proxy/), John Nunemaker wrote about [not making a human do what AI is amazing at](https://www.johnnunemaker.com/dont-make-a-human-do-what-ai-is-amazing-at/), and Simon Willison put real language around [what agentic engineering actually looks like](https://simonwillison.net/guides/agentic-engineering-patterns/what-is-agentic-engineering/).

Watching all of that gave me a rough picture, and I realized the only way I was going to actually understand how these machines work was to build them myself.

On October 30 I went down the rabbit hole for real. I started a TypeScript streaming library and tried to wire up agents that could keep shipping end-to-end features, updating documentation, and cleaning up the codebase while I was away from the keyboard. Over the next three weeks that project crossed 1,100 commits, and it taught me fast how wide the gap is between a loop that looks impressive in a demo and a machine you can leave running overnight.

## Trying to teach it before I understood it

Around November 9, about ten days in, I got excited enough that I started writing a continuous engineering guide on `thisistheway.to`.

Two days later I abandoned the draft.

Writing has a way of exposing everything you are hand-waving. I could describe the high-level idea of an autonomous loop, and I could not give someone honest, concrete advice about how to keep that loop from wedging itself at three in the morning. I was still guessing at the machinery. So I closed the draft and went back to building a real orchestrator from scratch.

## All the ways I built it wrong

Between November 11 and November 21, I built my first dedicated autonomous harness. It grew to about 855 commits, 99 source files, and roughly 27,500 lines of code, and I pointed it at the streaming library and a new storage engine project I started on November 18.

I learned a lot from running that harness around the clock, mostly by watching it fail in creative ways.

### Letting the agent supervise itself and own the state

Early on, I let long agent conversations carry too much state and asked agents to decide when their own work was ready. Over long runs the context drifted, agents graded their own diffs way too generously, and prompt-driven recovery could not reliably tell when a run was hung, spinning in circles, or bouncing back and forth between the same two fixes.

Ordinary deterministic code has to own the state, the leases, and the transitions, while each agent call stays short, bounded, and replaceable. I wrote that lesson up in [State & Contracts Outside the Context Window](https://thisistheway.to/engine/state-and-contracts).

### Piling patches onto a harness that was already too big

By the time the harness reached 99 files and 27,500 lines, I had lost the ability to hold the whole thing in my head. Every patch I added to handle one weird edge case seemed to introduce two new failure modes somewhere else.

Worse, when the orchestrator kept getting stuck, I caught myself building external babysitter loops to poke it back awake instead of fixing why it froze in the first place. Once you are building a supervisor to watch your supervisor, the foundation is telling you something.

### Trusting the builder's green checks

Earlier this year I wrote [The Work Can Look Done Before the Thinking Is Done](/posts/the-work-can-look-done-before-the-thinking-is-done/), and unattended agents proved that point faster than any human ever could. When nobody independent was reading the diff, a builder agent would occasionally weaken a test, loosen an assertion, or bump a timeout just to turn a red check green.

A passing test suite only proves what the tests actually check, and the agent that wrote a buggy change can easily write a generous test that misses it. Even an independent fresh-context reviewer only catches what you thought to specify, and two agents using similar models can still share the same blind spots. Verification moves the bottleneck toward specs and checks instead of removing it. Separating the builder from an independent reviewer, running pre-landing health checks, and using targeted rollback as a fast recovery heuristic when landing breaks became the backbone of [Independent Verification & Transactional Landing](https://thisistheway.to/engine/verification-and-landing).

### Ignoring boring systems hygiene until everything wedged

Most of the overnight failures were boring distributed-systems bugs dressed up as AI problems. Hung child and grandchild processes survived kills and kept holding locks. Brief network blips burned through retry budgets and killed healthy work. Duplicate readiness checks in the scheduler created quiet deadlocks where worker slots sat completely idle while waiting on approvals or blocked dependencies.

If you want a machine to keep making progress while you sleep, liveness has to be treated as a first-class engineering problem instead of an afterthought. I pulled all of those failure modes into [Never Getting Stuck: Watchdogs, Recovery & Liveness](https://thisistheway.to/engine/liveness-and-recovery).

## Starting over from scratch

Yesterday, on November 22, I stopped patching the 27,500-line harness and started over with a blank slate. I wrote down the principles I had learned the hard way over the previous three weeks and ran a bake-off, asking four frontier models to build the same minimal engine in separate Git worktrees, then having five models across different providers judge them blindly with live black-box fault probes until all five reached unanimous agreement. The winner came out to about 32 files and 5,500 lines of code, with no build step, one runtime dependency (the GitHub Copilot SDK, though any agent SDK could sit in that slot), and hard caps of 450 lines per source file and 150 lines for the README so a human or a fresh agent can still hold it in their head.

This time I committed to the core idea running through those Anthropic and OpenAI harness engineering writeups, stop trying to make an agent reliable enough to hold the whole system together, and build deterministic software reliable enough to run unreliable agents. The orchestrator owns SQLite leases and fences, runs each worker in its own Git worktree, wraps commands in detached process-group watchdogs, sends every change through an independent fresh-context reviewer and pre-landing health checks, and uses targeted rollback as a fast recovery move when health breaks (even when restoring green checks does not prove root cause on its own).

> [!NOTE]
> Git worktrees only isolate filesystems, not credentials, privileges, or network access. Real process sandboxing is still work ahead for anything beyond personal local repositories.

Last night I put the new engine under `launchd` across three live repositories to see what happened when I walked away. In roughly its first 24 hours it landed 137 verified commits, with 40% to 57% passing on the first try depending on the repo, which I actually like seeing because it means independent review is catching real defects almost half the time before they touch `main`. It rode out network blips without burning retries and proposed fix goals on its own for recurring rebase and test conflicts. It still hit a real bug around hour 20, when the scheduler and planner deadlocked each other, and instead of leaving tangled state it preserved clean raw evidence, took a bug description, proposed the fix plan, unified its own scheduler once I approved the direction, and shipped an exhaustive 3,456-state liveness test covering its scheduler transitions.

Real engineering landed in that stretch. On itself, the engine added oscillation guards to stop alternating retry loops, verified runtime upgrade rollbacks, graceful drain waits, and fixes for real pagination and concurrency bugs. On the streaming library, it shipped stateful distinct-count recovery, versioned relationship rollup fixes, and expiry-driven re-evaluation. On the storage engine, it ran controlled performance experiments on write-ahead log waits, Bloom-filter sizing, and checkpoint concurrency, and honestly rejected optimizations that came back inconclusive instead of forcing them into production code. A large share of those 137 commits were diagnostic benchmarks and result writeups rather than production features, which is why raw commit count is still not the metric I trust, and 24 hours is obviously early. Even so, for the first time in a month, the machine is small enough to reason about, honest when it fails, and producing work I would actually keep.

### Just-in-time decomposition

What made that hour-20 recovery work cleanly on the steering side was divorcing the design from any specific issue tracker or PR workflow and focusing on just-in-time decomposition. Trying to plan fifty steps up front almost always breaks down, because by step five the code has changed, a test has surfaced a new constraint, and half the original plan is stale.

Instead, you give the engine a complicated objective and clear constraints, let it break off only the next small, verifiable changes from the current state of the repository, and pair that with a tiered admission policy where a human approves the high-level direction and risky boundaries without approving every routine step. I wrote that pattern up in [Ambition, Self-Improvement & Human Steering](https://thisistheway.to/engine/ambition-and-steering), and added a final chapter on [Multiplayer & Multi-Machine Coordination](https://thisistheway.to/engine/multiplayer-coordination) for when more than one person or machine is feeding the same system, though right now my focus is still keeping a single machine rock solid.

## Coming back to teach it

Once the new engine was small enough to explain without hand-waving, I went back to the guide I had abandoned two weeks earlier and rewrote it from the ground up.

None of the individual ingredients in [Build a Continuous Software Engine](https://thisistheway.to/engine) are brand new. They come from ordinary distributed systems engineering, testing, the loop I started practicing last December around turning agent misses into systemic improvements, and what a lot of engineers have been sharing in the open this past year. Getting a machine to run overnight without falling over is only the start, and I am still trying to prove whether it produces better software over weeks and months instead of just more commits. If you have been watching the same talks and trying to build your own machine, I hope the guide saves you a few of the dead ends I ran into, and I would genuinely love to hear what breaks when you try it.

## Update, November 24

The engine ran overnight again across all three repositories, landing 109 autonomous commits over the past 24 hours (54 of them after I published this post last night).

It still needed a bit of steering and a few small fixes through the night. Before bed I had broadened the ambition docs so routine work stopped waiting on human approval and then it nudged the storage engine to move from profiling to shipping real optimizations, and a handful of boring systems bugs turned up on the engine itself, like a short retry backoff triggering duplicate planning, dangling handles blocking process exit, and brief network blips interrupting claim renewals.

Since that last fix landed at 3:14 AM, there have been zero interventions. All three loops have been running cleanly on their own for more than four hours straight, riding out real transient network timeouts without losing work.

What shipped overnight also felt like a clear step up from night one. The engine built out its own multi-project local dashboard with pause, retry, and approval controls, and even noticed that module approaching the 450-line cap and split it up on its own. The streaming library shipped real stateful operators like recoverable session windows and hopping-window joins. And the storage engine moved past diagnostic benchmarks to land real production speedups on its write-ahead log and compaction paths (including roughly 2× to 3× throughput gains on writes and checksums), while still honestly reverting four other candidates that regressed latency or memory.

It is still only 48 hours in, and I am sure more edge cases are waiting, but watching the interventions taper off while the work landing gets more substantive is the first real sign that this setup is starting to hold.
