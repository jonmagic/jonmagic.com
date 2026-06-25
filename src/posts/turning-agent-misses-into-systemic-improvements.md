---
layout: layout
title: Turning Agent Misses into Systemic Improvements
date: 2025-12-30
avatar: /images/posts/turning-agent-misses-into-systemic-improvements/jonmagic-and-copilots-at-the-software-assembly-line.webp
tags:
  - post
description: >-
  Stop treating agent misses as bugs to fix and start treating them as gaps to close. Every mistake becomes a reason to add a test, document a pattern in a skill, or tighten the instructions. Free yourself to solve new problems instead of re-solving the same ones.
featured: 3
accent: amber
---

Over the holiday break I decided to rebuild a slice of an internal web app from my day job as a webview experience inside VS Code. The goal wasn't really the feature itself—it was to force myself to learn the [VS Code extension APIs](https://code.visualstudio.com/api) and to get my hands dirty with [Open Truss](https://github.com/open-truss/open-truss), an open-source workflow framework I've been collaborating on with [@hktouw](https://github.com/hktouw) and [@kmcq](https://github.com/kmcq).

I started where I usually do: drafting a plan, spinning up a workspace, and asking Copilot to start coding. *But as I worked I got annoyed with doing things the way I've been doing them the past year—constantly steering the agent, pasting browser console errors, describing visual bugs, and nudging it back on track.* The loop I'd used for most of 2025 now felt too fragile.

![jonmagic standing at the software assembly line with agents working the line](/images/posts/turning-agent-misses-into-systemic-improvements/jonmagic-and-copilots-at-the-software-assembly-line.webp)

Then I watched [this interview](https://www.youtube.com/watch?v=rIrxkB-02P0) about [SKILLS.md](https://agentskills.io) in Copilot, learned about the [Ralph Wiggum AI technique](https://ghuntley.com/ralph/), read [Niklas Heidloff's post from March 2025 on why agents fail](https://heidloff.net/article/why-agents-fail/), and [Steve Krenzel's piece on the infrastructure tax teams should pay](https://bits.logic.inc/p/ai-is-forcing-us-to-write-good-code), and a few things started to click.

## The Shift

I was spending more time debugging the agent than building features. The loop went like this: prompt Copilot, review the output, find the bug, explain what went wrong, try again. I was the debugger, and every iteration took seconds or minutes because I had to context-switch between the code, the terminal, and the running VS Code extension.

Then I changed one thing. Instead of just fixing what broke, I started asking: **what didn't the agent see?**

If it hallucinated a GraphQL field, the schema wasn't visible. If it picked the wrong component, the registry docs were incomplete. If the layout looked wrong, there was no visual gate. Each failure pointed to missing observability or incomplete instructions.

**So I stopped treating agent misses as bugs to fix and started treating them as gaps to close. Every mistake became a reason to add a test or eslint rule, document a pattern in a skill, or tighten the instructions. The work shifted—less "write this code for me" and more "here's how to see when you're wrong."**

## A Little Setup

Before we dive into the examples below let me explain a bit about the project I was working on. It's a web-based Kafka consumer monitoring tool that engineer first responders use to debug stream processing issues—checking consumer lag, partition assignments, offset tracking, etc.

The existing web app worked fine, but it lived in a browser tab that engineers had to context-switch to. I wanted to bring those affordances into the editor closer to where the changes to address issues actually happens. Click a consumer name in your code, see its current state, jump to logs or metrics—all without leaving VS Code.

> [!NOTE]
> I think about the intersection of internal tools and AI a lot, so this project was a good fit to see how deeply I can integrate agents and mcp tools into the workflows my stakeholders (analysts, support staff, first responders) use every day. I chose [Open Truss](https://github.com/open-truss/open-truss) because we designed it to empower non-engineers to build internal tools with minimal coding, and I wanted to see how AI agents could help fill in the gaps.

I also setup this particular project with three distinct agents:
- **The Planner**: An agent that breaks down high-level feature requests into discrete implementation steps.
- **The Implementer**: An agent that writes the code based on high-level feature requests.
- **The Reviewer**: An agent that reviews the Implementer's code for correctness, style, and adherence to best practices.

## Turning Misses into Hits

Here are a few examples of how I turned agent misses into systemic improvements that made future iterations smoother.

### Example 1: Hallucinated GraphQL Fields

The first systemic failure showed up early. The Implementer built a consumer list workflow and wrote a GraphQL query to fetch consumer data:

```graphql
query AppConsumers {
  appConsumers {
    consumers {
      consumerName
      groupId
      status        # ✗ ERROR
    }
  }
}
```

When I ran the workflow, it crashed with a schema error:

```
[GraphQL] Cannot query field "status" on type "AppConsumer"
```

I asked Copilot to help me understand what went wrong. It found that the `status` field existed on the parent response object (`AppConsumersResponse`), not on individual consumers.

I could've just asked Copilot to fix the query and moved on. Instead, I asked: **what's preventing the agent from seeing this before it writes the code?**

The schema file lived in `generated/schema.graphql`—96,000 lines synced from the backend. The agent wasn't checking it. So I asked Copilot to build a skill that codified the validation workflow:

**From `.github/skills/graphql-schema-validation/SKILL.md`:**

```markdown
## Critical Rule
**ALWAYS verify GraphQL queries against the actual schema before implementation.**

### Step 4: Search the Schema
Use grep to find type definitions:

# Find a type definition
grep -A 10 "^type AppConsumer {" generated/schema.graphql
```

**Example output:**
```graphql
type AppConsumer {
  consumerName: String!
  groupId: String
  topic: String!
}
```

Notice: No `status` field exists on `AppConsumer`.

Then I had Copilot add it to the agent instructions:

```markdown
- **GraphQL queries**: Always validate against the schema before writing queries.
  Use grep to verify field existence on target types. Never assume field availability.
  See `graphql-schema-validation` skill.
```

The next time the Implementer needed to write a query, it ran `grep -A 10 "^type ConsumerPartition {" generated/schema.graphql` first, saw which fields actually existed, and got it right. No hallucinations. No runtime crashes.

### Example 2: Stale Renders from Missing `useSignals()`

A few days in, I noticed a pattern. The agent would build a component that read from a signal prop—say, a table that displays consumer data from `:consumerData`—and the table would render once with empty data, then never update when the signal changed.

Here's what the component looked like:

```tsx
export function ConsumerTable({ dataSignal }: { dataSignal: { value?: Consumer[] } }) {
  const data = dataSignal?.value ?? []
  return (
    <Table>
      {data.map(row => <TableRow key={row.id}>{row.name}</TableRow>)}
    </Table>
  )
}
```

The data would load, the signal would update, but the table stayed frozen on "No data found."

The problem: Open Truss signals use Preact signals under the hood. React doesn't automatically subscribe to `.value` changes unless you call `useSignals()` at the top of the component (at least the way we're using it right now). Without it, you get stale renders.

I could've just added the hook and moved on. But I'd already debugged this three times that week. So I asked: **how do I make this failure impossible?**

Copilot updated the component-wrapper skill with a clear warning:

**From `.github/skills/open-truss.component-wrapper/SKILL.md`:**

```markdown
### ⚠️ Signal-aware components MUST call `useSignals()`

If a component **reads or writes any signal prop** (props passed as `:signalName`),
call `useSignals()` at the top of the function body **before** deriving values or rendering.

import { useSignals } from '@open-truss/open-truss'

export function MySignalConsumer({ valueSignal }: { valueSignal: { value?: string } }) {
  useSignals()  // ← Required for reactivity
  const value = valueSignal?.value ?? ''
  return <div>{value}</div>
}

Missing `useSignals()` leads to stale renders (tables showing "No data found",
badges not updating, etc.) even though the signal value changes.
```

And it added it to the checklist at the bottom of the skill:

```markdown
- [ ] `useSignals()` is called when any prop is a signal reference (reads/writes `:signalName`)
```

After that, every new component got it right on the first try. The agent would see the warning, add the hook, and the stale render bug vanished.

### Example 3: Test Harness First, Features Second

Manual testing was killing me. I'd ask the agent to build a feature, press F5 to launch the VS Code development window, click around, find a bug, describe it back to the agent, and repeat. The loop took seconds of my time per iteration.

I asked Copilot to build a Playwright harness that ran Open Truss workflows in a real browser, mocking the VS Code boundary. Now every workflow got a co-located test file that ran *before* I ever opened VS Code:

```typescript
// workflows/consumer-detail.test.ts
test('detail tab opens with correct args', async ({ page }) => {
  // Listen for VS Code command before clicking
  const commandPromise = page.evaluate(() => {
    return new Promise((resolve) => {
      window.addEventListener('vscode-command', (e: any) => {
        resolve(e.detail)
      }, { once: true })
    })
  })

  await page.click('[data-testid="consumer-row-1"]')

  const command = await commandPromise
  expect(command.command).toBe('app.openWorkflow')
  expect(command.args.workflow).toBe('consumer-detail')
  expect(command.args.consumerName).toBe('signal-processor')
})
```

This became a gate: the Implementer couldn't claim a feature was done until this test passed. No test, no merge. The payoff showed up immediately—test failures told me *exactly* which assertion broke, not just "it doesn't work."

### Example 4: Visual QA Catches What DOM Assertions Miss

After getting tests passing, I kept finding AI generated UI slop that DOM checks couldn't catch: large gaps between components, weird alignment, UI that just didn't make sense. So I asked Copilot to add a visual QA step leveraging the [llm cli](https://github.com/simonw/llm):

```typescript
test('consumer badges have consistent spacing', async ({ page }) => {
  const screenshot = await page.screenshot()

  const result = await runVisualQA({
    screenshot,
    criteria: [
      'Status badges have 16px horizontal gap between them',
      'No badges overlap or clip',
      'Badge text is readable and not truncated'
    ],
    model: 'gpt-4.1'
  })

  expect(result.verdict).toBe('pass')
})
```

The `runVisualQA` function captures the screenshot and pipes it to a headless reviewer that checks for overlap, clipping, and visual affordances. Now visual correctness became data, not vibes. Copilot even added this to the workflow spacing skill so future implementations got it right from the start.

> [!WARNING]
> You should disable this for CI unless you like to :fire::dollar:

## What I Learned

Over the last few days of this project, I shipped roughly equal amounts of features and guardrails. Looking at the git log, the commits cluster into three arcs:

1. **Features**: Kafka consumer monitoring, list/detail splits, templated links, new tab routing
2. **Observability + guardrails**: Visual QA hooks, workflow spacing standards, registry validation tests
3. **Enablement plumbing**: Composite builds, schema sync, test harnesses, agent skills

The payoff was measurable. Human-in-the-loop density dropped from *every few minutes* to *once per slice.* The Implementer could take a high-level feature request and deliver working code with minimal back-and-forth. The agents made fewer mistakes because they could see their failures.

Each failure turned into improved observability, a new skill, or clearer instructions. Those improvements compounded. By week two, features that would've taken five to ten rounds of steering are landing in one or two.

## What's Next

Now I'm teaching my implementation and review agents to tell me about ways to improve themselves. I want them to suggest updates to the skills they use. The goal is a self-improving AI collaborator that gets better at building software with each iteration, not just faster at writing code.

A lot of the [vocal community is exploring memory systems](https://news.ycombinator.com/item?id=46426624)—databases that persist agent context across sessions, semantic search over past decisions, knowledge graphs of what was learned. That approach treats agent failures as a recall problem: if only the agent remembered the last time it made this mistake, it wouldn't repeat it.

For now at least I'm going the opposite direction. Every time the agent sees my project with fresh eyes, it's testing whether the codebase is clear enough to guide a newcomer. If it keeps hitting the same GraphQL field hallucination, that's not a memory gap—it's missing observability. The schema validation skill I built isn't a workaround for forgetfulness; it's a permanent improvement that makes that entire class of failure impossible.

If you're building with agents, stop trying to prompt your way out of the same agent misses over and over. Build the observability they need to see the world clearly and the skills to improve themselves.
