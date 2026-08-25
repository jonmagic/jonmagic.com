---
title: Trusted Does Not Mean Unlimited
date: 2026-07-21
avatar: /images/posts/trusted-does-not-mean-unlimited/panel-04.webp
tags:
  - post
description: >-
  Trust should not be a blank check. For expensive product capabilities,
  access should grow with evidence while teams measure both exposure and
  legitimate-user friction.
accent: blue
---

> [!TLDR]
> Trust should not be a blank check. For expensive product capabilities that can be abused at scale, access should grow with evidence, and teams need to measure both the abuse they prevent and the legitimate users they slow down.

For a long time I have used and taught a pretty simple model for commercial abuse at scale. The adversary is basically running a business, just a dishonest one. When a platform gives away something valuable, they will try to turn it into money, attention, compute, reputation, reach, or access. The defender's job is to change the math until extracting that value is no longer worth the cost.

Through mentors, recent work, and a lot of conversations with people who have lived different versions of this problem, I have come to think the model still works, but I need to ask one more question.

What are we giving them before we know whether the math still works for us?

I have learned to think about that value as exposure.

![A glowing reservoir releasing valuable compute through an open valve](/images/posts/trusted-does-not-mean-unlimited/panel-01.webp)

## Exposure

Any control changes the cost paid by the abuser, the defender, and legitimate users. Exposure is the value a product has already handed out while it is still figuring out whether the relationship is real. For costly usage, the platform may be holding a bill that payment never covers. For a marketplace, the exposure may be buyer trust, support load, scams, or reputation damage.

The abuse work I know best starts with finding harmful activity faster. Find the pattern, build the signal, route the enforcement, measure false positives, and keep tightening the loop. That work is still essential, but when the problem is exposure, detection is often late by design. By the time the system is confident, value may already have moved and a legitimate customer may already be stuck behind a blunt control.

For much of the software industry, especially developer tools and collaboration platforms, the default has been trust first. Let people in, let them try the thing, and slow them down when their behavior looks risky. I have spent my career believing in lowering barriers for developers, and I still do. I just think the cost curve has changed for a growing set of product capabilities.

Some of that is AI. Accounts have always been cheap to create, and now they are cheap to operate too, because an agent can run one. Account history that used to accumulate at human speed can now be driven by software, faster than a person and across many more accounts. A long-lived account might be acting through a new key, a new context, or an agent that deserves more caution than the account's history would suggest. And the capability this wave wants most is compute, which is expensive, easy to resell, and hard to recover.

For capabilities that are expensive, easy to resell, or hard to recover, trust first can quietly become a loan you did not mean to issue.

![Evidence gradually opening a valve to release more valuable capability](/images/posts/trusted-does-not-mean-unlimited/panel-02.webp)

## Let access grow with evidence

I want the first grant to be useful, then let access grow as the user gives the product more evidence. Legitimate users also need a clear path forward when the system is too cautious.

OpenAI's API usage tiers and Google Cloud's paid-billing gates show two versions of the same idea. Capacity can grow with a track record, and some high-cost capabilities can wait for a stronger commitment.

Imagine a developer platform that offers an expensive compute capability. An account made one successful payment months ago, so a general account system considers it trusted. Later, the account requests 100 units of compute, far more than its payment history supports. The product grants 10 units first and explains that more access becomes available as payment and usage history build. If the system is too cautious, the user has a path to review.

The payment is evidence, "trusted" is an inference, the 10-unit grant is access, and the unpaid compute is exposure. The decision is whether the evidence supports this capability up to this amount of exposure right now.

At decision time, the system records the facts it had, the access it granted, why it made that decision, and what it still did not know. Later, the team can see whether payment settled, usage looked legitimate, the user earned more access, or the limit caused abandonment or a support request. It can replay a proposed 20-unit grant using only the original facts and compare the added exposure with the legitimate-user friction.

![A small useful compute grant held against a much larger request](/images/posts/trusted-does-not-mean-unlimited/panel-03.webp)

If the likely exposure across normal product volume is smaller than the cost of building and operating that control, accepting the exposure may be the right decision. If the exposure is larger and hard to recover, the investment starts to make sense.

The user experience gets hard here. A wall with no explanation feels like rejection, while a wall that explains too much becomes a playbook. Tell people which capability is limited, what they can do to get more access, and where to go if the system is wrong, without publishing the exact signals or thresholds an adversary could script around.

"Trusted does not mean unlimited" has started to feel useful to me.

Trusted for what? Based on which evidence? Up to how much exposure?

That answer can change without becoming a moral judgment about the user. A new key, device, automation pattern, payment reversal, or jump in usage can make yesterday's grant too large for today's uncertainty. The product needs to be able to narrow access, ask for more proof, or slow the next increment until the relationship is clearer again.

## Keep uncertainty visible

Real systems make that harder. A product flow wants to keep moving, a payment system has its own fallback, and a high-traffic service has to preserve availability. Each local default may make sense on its own, but when they combine, the company may not know whether it made a real risk decision or inherited a chain of fallbacks.

When a product ships a valuable capability, it also ships an incentive system. Product teams do not need to become abuse experts, but they do need to own the first grant, the evidence that earns more, the missing-evidence behavior, and the recovery path when the system is wrong.

The product owner for the capability should make that tradeoff before launch and stay accountable for it afterward. Safety teams can help with signals and outcomes, and Engineering can provide shared decision logging and recovery primitives so every team does not have to invent its own trust system.

Exposure is loud and a little scary, while friction is the conversion you lost, the legitimate user who hit a wall when they were ready to commit, or the support ticket from someone who did nothing wrong. The loop is not honest unless it weighs both. At minimum, that means comparing value withheld and unpaid value avoided with conversion at the limit, review completion, and support requests.

Plenty of product capabilities should stay open by default because they are cheap, mistakes are recoverable, and nothing valuable is hard to claw back. Earned access belongs where the next unit is economically meaningful and hard to unwind, like higher API usage, cloud quota increases, GPUs, marketplace access, seller payouts, bulk outreach, or privileged automation.

For years, I thought about abuse as a loop where adversaries adapt, defenders detect, and product changes move the incentives. I still think that is true, but I was starting the loop too late. It starts when the product decides how much value to extend while trust is still being earned.

![A product owner balancing exposure and legitimate-user friction](/images/posts/trusted-does-not-mean-unlimited/panel-04.webp)
