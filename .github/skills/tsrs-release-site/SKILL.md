---
name: tsrs-release-site
description: Update jonmagic.com for new Tri-State Relay Service releases. Use when publishing a TSRS release, updating /tsrs/ version notes, versioned download links, or release changelog from ~/code/jonmagic/tri-state-relay-service.
---

# TSRS Release Site

## Overview

Maintain the jonmagic.com product page and related site surfaces for Tri-State Relay Service releases.

This skill keeps the public site aligned with the TSRS app release without turning the site into a full release engineering system. The site should point the main CTA at the current versioned release archive, show the current public version, and include a concise changelog based on the release window.

## When to Use

Use this skill when:

- A new Tri-State Relay Service app release is cut.
- `/tsrs/` needs a version, release note, or download update.
- The versioned download URL or release archive needs to be checked.
- A public changelog needs to be drafted from recent TSRS commits.
- The TSRS project card or homepage copy needs to stay aligned with the release.

## Source Repositories

- Site repo: `~/code/jonmagic/jonmagic.com`
- App repo: `~/code/jonmagic/tri-state-relay-service`

## Release Source of Truth

Read the TSRS version from the app repo:

1. `src/macos/Info.plist`, key `CFBundleShortVersionString`
2. `src/macos/RelayCore.swift`, constant `relayCliVersion`

The app and CLI versions should match. If they do not match, stop and report the mismatch before editing the site.

Useful commands:

```sh
/usr/libexec/PlistBuddy -c "Print :CFBundleShortVersionString" ~/code/jonmagic/tri-state-relay-service/src/macos/Info.plist
rg 'let relayCliVersion = ' ~/code/jonmagic/tri-state-relay-service/src/macos/RelayCore.swift
```

## Download URL Rules

Point the public download button at the current versioned archive:

```text
/downloads/Tri-State%20Relay%20Service-<version>-macos-<arch>.zip
```

For example:

```text
/downloads/Tri-State%20Relay%20Service-1.0.0-macos-arm64.zip
```

For each release, check that the versioned archive is present:

```text
src/downloads/Tri-State Relay Service-<version>-macos-<arch>.zip
```

Do not add or rely on an unversioned `Tri-State Relay Service.zip` download unless the user explicitly asks.

## Changelog Rules

For `/tsrs/`, update the `## Current release` section.

Use a concise public changelog. Do not summarize all pre-release history unless the user asks for launch-summary copy. For release notes, use only the release window:

- Prefer the previous release tag or previous version boundary when available.
- For the first public release, use the user-provided time or commit boundary.
- If the boundary is ambiguous, ask before drafting release notes.

Good 1.0.0-style wording:

```md
## Current release

**1.0.0 — Initial public release**

Tri-State Relay Service is now available as a signed direct-download macOS app. This release adds visible app and CLI versioning, and the download button points directly at the versioned release archive.

The app and `relay` CLI should both report `1.0.0`.
```

## Site Surfaces to Check

1. `src/tsrs.md`
   - Hero download URL should point at the current versioned archive.
   - `## Current release` should show the current version.
   - Getting-started instructions should still match the app behavior.
2. `src/projects/tri-state-relay-service.md`
   - Description should still match product positioning.
3. `src/index.njk`
   - Homepage TSRS feature copy should still be accurate.
4. `src/downloads/`
   - The current versioned zip file should be present when publishing.

## Workflow

1. Inspect the app repo version metadata.
2. Verify app and CLI versions match.
3. Inspect recent TSRS commits using the correct release boundary.
4. Draft a short public changelog for `/tsrs/`.
5. Update the site surfaces that need version or release copy changes.
6. Confirm the download URL points at the current versioned archive.
7. Run `npm run build` in the site repo.
8. Report changed files and any release assumptions.

Do not commit or push unless the user explicitly asks.

## Example Prompts

- "Update the TSRS site for version 1.0.1."
- "Refresh the /tsrs/ changelog from the latest TSRS release."
- "Check whether the TSRS download page matches the app version."
- "Publish the new TSRS release notes on jonmagic.com."
