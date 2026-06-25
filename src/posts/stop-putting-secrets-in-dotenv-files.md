---
title: "Stop Putting Secrets in .env Files"
date: 2026-02-27
avatar: /images/posts/stop-putting-secrets-in-dotenv-files/secure-env-demo.webp
featured: 4
tags:
  - post
description: >-
  Your .env files are a liability. Two simple patterns for injecting secrets
  from 1Password or macOS Keychain so credentials never touch disk as plaintext.
accent: blue
eyebrow: "SECURITY · 2026"
disableMerchCta: true
popular: true
kit:
  - label: Demo
    text: jonmagic/secure-env-demo
    url: https://github.com/jonmagic/secure-env-demo
    target: secure-env-demo
  - label: Tool
    text: 1Password CLI
    url: https://developer.1password.com/docs/cli/
    target: 1password-cli
  - label: Tool
    text: dotenvx
    url: https://dotenvx.com
    target: dotenvx
  - label: Discuss
    text: Discussion on this post
    url: https://github.com/jonmagic/jonmagic.com/discussions
    target: site-discussions
---

> [!NOTE]
> **Update (Feb 28, 2026):** This post got a lot of discussion on [Hacker News](https://news.ycombinator.com/item?id=47188465) and [Lobsters](https://lobste.rs/s/eai9st/stop_putting_secrets_env_files). Two things worth addressing.
>
> First, several people pointed out [1Password Environments](https://developer.1password.com/docs/environments/local-env-file), a newer feature I hadn't tried yet. It mounts a `.env` file backed by a UNIX named pipe (FIFO) so your existing dotenv libraries just work, but no plaintext ever lands on disk. Authorization persists until 1Password locks, which solves the repeated Touch ID prompts you'd get with `op run`. If you're already using 1Password this is probably the best option available today.
>
> Second, a fair critique. Injecting secrets as environment variables doesn't make them invisible. On Linux, any process running as your user can read `/proc/self/environ` (or `/proc/<pid>/environ` for other processes you own). On macOS there's no `/proc` filesystem, but environment variables are still accessible through other means. Runtime injection is a meaningful improvement over plaintext files sitting on disk, but it's not a complete security boundary. For higher-stakes environments, look at tools that use short-lived credentials, mounted secrets via tmpfs, or hardware-backed keystores.

A few weeks ago my friend Harrison ([@hktouw](https://github.com/hktouw)) and I did our yearly Tesla FSD cruise around the Bay Area — seven hours of letting the car drive while we talk about whatever comes to mind. This was the first year we never had to take over the wheel, which meant even more time for conversation. We covered AI adoption, investing, and then landed on something that's been bugging me for a while. Why do we still store credentials in plaintext `.env` files?

I'd been using 1Password to store individual secrets for a while, pulling them one at a time with the CLI. Harrison took it a step further. "Why not store the whole `.env` file's worth of secrets as fields in a single 1Password item?" he said. Simple. Obvious in hindsight. And it led me down a rabbit hole of rethinking how I handle secrets in every project.

The result is a pattern I've been using for the past month that I want to share. It's not complicated. It doesn't require enterprise tooling. It works today with tools you probably already have.

<video src="/images/posts/stop-putting-secrets-in-dotenv-files/secure-env-demo.mp4" controls width="100%"></video>

## The problem with .env files

We all know `.env` files are supposed to be gitignored. And they usually are. But beyond the git risk, having credentials stored in plaintext just feels bad. If you leave your laptop unlocked at a coffee shop or someone gets access to your machine, those `.env` files are sitting right there — high-value targets with zero protection.

Here's what actually happens with `.env` files.

- They get copied into Slack DMs when onboarding a new teammate
- They accumulate across 20+ projects with the same stale API key
- A credential gets rotated and you're hunting through every project directory to find the copies
- Someone clones the repo on a new machine and asks you to send them the `.env` file
- They sit on disk as plaintext, readable by any process running as your user
- If someone gains access to your machine, they instantly have every credential you've ever stored this way

The twelve-factor app told us to put config in the environment. Good advice. But `.env` files are a leaky implementation of that principle. They're plaintext files pretending to be environment variables.

## Inject at runtime, never store on disk

The pattern is simple. Instead of loading secrets from a file, you use a wrapper script that fetches secrets from a secure store and injects them as environment variables into your process:

```bash
# Instead of this:
source .env && node server.js

# Do this:
./with-1password.sh node server.js
# or
./with-keychain.sh node server.js
```

Your application doesn't change at all. It still reads `process.env.API_KEY` or `$DATABASE_URL` the same way it always did. The difference is where the values come from.

I built a [demo repo](https://github.com/jonmagic/secure-env-demo) with two working implementations: one for 1Password CLI and one for macOS Keychain. You can clone it and try both in about five minutes.

## 1Password CLI

This is the approach Harrison and I were originally talking about, and it's the one I reach for most. If you already use 1Password, the CLI (`op`) makes this almost frictionless.

The key insight is that 1Password supports **secret references** — URIs like `op://Development/myapp/api-key` that point to a field in your vault. You can put these references in a file that's safe to commit:

```bash
# .env.1password — safe to commit, contains no secrets
API_KEY=op://Development/secure-env-demo/api-key
DATABASE_URL=op://Development/secure-env-demo/database-url
WEBHOOK_SECRET=op://Development/secure-env-demo/webhook-secret
```

Then the wrapper script is almost trivially simple:

```bash
#!/usr/bin/env bash
exec op run --env-file=".env.1password" -- "$@"
```

That's it. `op run` reads the references, fetches each secret from your vault (authenticating via Touch ID or your master password), injects them as environment variables, and runs your command. Secrets never touch disk as plaintext. As a bonus, `op run` automatically masks secret values if they accidentally appear in stdout.

**Setup is a one-time thing.** You create a vault item with your secrets (the demo repo includes a setup script for this), customize the references in `.env.1password`, and you're done. Every developer on the team can share the same `.env.1password` file in version control and resolve it against their own 1Password account.

## Or macOS Keychain

Not everyone uses 1Password, and that's fine. If you're on a Mac, you already have a secrets manager built into the OS. The `security` command can read and write to your login keychain, and macOS gates access with your password or Touch ID.

The wrapper script reads each secret from Keychain and exports it.

```bash
#!/usr/bin/env bash
declare -A SECRETS=(
  [API_KEY]="secure-env-demo/api-key"
  [DATABASE_URL]="secure-env-demo/database-url"
  [WEBHOOK_SECRET]="secure-env-demo/webhook-secret"
)

for var in "${!SECRETS[@]}"; do
  service="${SECRETS[$var]}"
  value=$(security find-generic-password -a "$USER" -s "$service" -w)
  export "$var=$value"
done

exec "$@"
```

Storing a secret is one command.

```bash
security add-generic-password -a "$USER" -s "secure-env-demo/api-key" -w "sk-your-key" -U
```

It's a bit more manual than the 1Password approach — you maintain the mapping in the script rather than a reference file — but it works without any third-party dependencies.

## What you gain

The immediate benefit is obvious — no more plaintext secrets on disk. But there are a few less obvious wins.

**One source of truth.** When a credential rotates, you update it in one place. Every project that references it picks up the change automatically.

**Onboarding gets simpler.** Instead of "here's the `.env` file, don't lose it," you say "set up 1Password and run the setup script." The secrets are in the vault with proper access controls.

**Auditing.** 1Password and Keychain both maintain access logs. You can see who accessed which secrets and when. A `.env` file gives you none of that.

**It works with anything.** The wrapper pattern is language and framework agnostic. `./with-1password.sh docker compose up` works just as well as `./with-1password.sh pytest`.

## What about other tools?

There's a whole ecosystem of secrets management tools — [Doppler](https://doppler.com), [Infisical](https://infisical.com), [HashiCorp Vault](https://www.vaultproject.io/), [SOPS](https://github.com/getsops/sops), [dotenvx](https://dotenvx.com). They're all good, and if you're running a team of 50+ engineers you should probably be evaluating them.

But for most developers working on personal projects or small teams, the 1Password or Keychain approach hits a sweet spot: minimal setup, no infrastructure to manage, and you're probably already paying for the tools.

The important thing isn't which tool you pick. It's the pattern. **Store secrets in a vault, inject at runtime, never write plaintext to disk.**

## Try it

The [secure-env-demo](https://github.com/jonmagic/secure-env-demo) repo has everything you need to try both approaches. Clone it, pick the one that fits your setup, and run the demo app:

```bash
git clone https://github.com/jonmagic/secure-env-demo.git
cd secure-env-demo

# 1Password path:
./setup-1password.sh
./with-1password.sh ./app.sh

# Keychain path:
./setup-keychain.sh
./with-keychain.sh ./app.sh
```

It's a small change to how you work, but once you do it you won't go back. Every time I see a `.env` file now I think about that conversation in the Tesla and wonder why I didn't do this years ago.
