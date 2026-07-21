---
name: release-notes
description: "Generate user-facing release notes from tickets, PRDs, or changelogs. Creates clear, engaging summaries organized by category (new features, improvements, fixes). Use when writing release notes, creating changelogs, announcing product updates, or summarizing what shipped."
---

> **Provenance.** Vendored from `phuryn/pm-skills@release-notes` (MIT, Paweł Huryn / Product Compass — github.com/phuryn/pm-skills). Adapted into great-pm 2026-05-29 with attribution. Host agent: launch-manager.

## Release Notes Generator

Transform technical tickets, PRDs, or internal changelogs into polished, user-facing release notes.

### Context

You are writing release notes for **$ARGUMENTS**.

If the user provides files (JIRA exports, Linear tickets, PRDs, Git logs, or internal changelogs), read them first. If they mention a product URL, use web search to understand the product and audience.

### Instructions

1. **Gather raw material**: Read all provided tickets, changelogs, or descriptions. Extract:
   - What changed (feature, improvement, or fix)
   - Who it affects (which user segment)
   - Why it matters (the user benefit)

2. **Categorize changes**:
   - **New Features**: Entirely new capabilities
   - **Improvements**: Enhancements to existing features
   - **Bug Fixes**: Issues resolved
   - **Breaking Changes**: Anything that requires user action (migrations, API changes)
   - **Deprecations**: Features being sunset

3. **Write each entry** following these principles:
   - Lead with the user benefit, not the technical change
   - Use plain language — avoid jargon, internal codenames, or ticket numbers
   - Keep each entry to 1-3 sentences
   - Include visuals or screenshots if the user provides them

   **Example transformations**:
   - Technical: "Implemented Redis caching layer for dashboard API endpoints"
   - User-facing: "Dashboards now load up to 3× faster, so you spend less time waiting and more time analyzing."

   - Technical: "Fixed race condition in concurrent checkout flow"
   - User-facing: "Fixed an issue where some orders could fail during high-traffic periods."

4. **Structure the release notes**:

   ```
   # [Product Name] — [Version / Date]

   ## New Features
   - **[Feature name]**: [1-2 sentence description of what it does and why it matters]

   ## Improvements
   - **[Area]**: [What got better and how it helps]

   ## Bug Fixes
   - Fixed [issue description in user terms]

   ## Breaking Changes (if any)
   - **Action required**: [What users need to do]
   ```

5. **Adjust tone** to match the product's voice — professional for B2B, friendly for consumer, developer-focused for APIs.

Save as a markdown document. If the user wants HTML or another format, convert accordingly.

## Developer changelog vs marketing release notes

These are two different artefacts with two different audiences. Do not collapse them into one.

| | **Developer changelog** | **Marketing release notes** |
|---|---|---|
| Audience | Engineers integrating your API / SDK | End users, buyers, the press |
| Unit | Every change, including internal | The handful of changes users feel |
| Voice | Precise, terse, factual | Benefit-led, warm, plain |
| Version detail | Exact semver, deprecated endpoints, signature diffs | "What's new" framing, often no version at all |
| Cadence | Every release, append-only | Bundled — monthly or per meaningful milestone |
| Source of truth | Git tags / conventional commits | Curated from the changelog + PRD intent |
| Example | `v2.4.0 — BREAKING: removed deprecated /v1/txns; categorize() now returns confidence: float` | "Acme now tells you how sure it is about each category, so you can trust the auto-tagging at a glance." |

A clean pipeline: the developer changelog is the raw, complete record; the marketing release notes are a *curated, re-voiced subset* of it. Never publish the changelog verbatim as your release notes — it leaks internal detail and buries the user benefit.

## Worked example — Acme v2.4 (transformation)

Raw input (Linear tickets + git log):

```
XP-412  Implement per-merchant confidence score in categorizer (Redis-backed)
XP-431  Fix race in concurrent PDF + Gmail dedup ("Project Heron")
XP-440  Migrate /v1/transactions → /v2/transactions; /v1 deprecated
XP-447  Add Tamil + Telugu merchant-name normalization
XP-455  Bump qwen2.5-coder:14b → :32b on the Mac Mini worker
```

Curated marketing release notes:

```markdown
# Acme — v2.4 (June 2026)

## New Features
- **Category confidence**: Acme now shows how sure it is about each
  auto-categorized transaction, so you know at a glance which ones to
  double-check.

## Improvements
- **Better support for South Indian merchants**: Tamil and Telugu
  merchant names are now recognized and categorized correctly.

## Bug Fixes
- Fixed a rare case where a transaction imported from both a PDF
  statement and a Gmail alert could appear twice.

## Breaking Changes
- **Action required (API users only)**: the `/v1/transactions` endpoint
  is deprecated and will be removed on 2026-12-01. Migrate to
  `/v2/transactions` — see the migration guide.
```

What got dropped and why:
- **XP-431's codename "Project Heron"** never appears — internal codenames leak roadmap signal and mean nothing to users.
- **XP-455 (model upgrade)** is invisible to users; it belongs in the developer changelog and the internal release log, not here. Users feel the *result* (better accuracy), which is folded into the confidence/normalization items, not the mechanism.
- The **Redis detail in XP-412** is gone — implementation, not benefit.

## When NOT to write public release notes

- **Security fixes — ship silently.** Publicly itemizing a vulnerability ("fixed an auth bypass in PDF parsing") hands attackers a roadmap to unpatched older installs. Patch first, disclose later via a coordinated advisory (CVE / security page), not the consumer release notes.
- **Internal-only or infra launches.** A backend migration, a worker-model swap, a logging change — no user-facing surface, so no user-facing note. Log it in the internal release record and the developer changelog if it touches the API.
- **Closed beta / dogfood builds.** A handful of known testers don't need a polished notes page; a Slack message or beta-channel post is the right weight. Save the formal notes for GA.
- **A/B-test variants and dark launches.** Don't announce a feature half your users can't see — you'll generate support tickets for a thing the user "can't find."
- **Trivial copy/UI tweaks** with no behavior change — bundle into the next real release rather than crying wolf with a notes update.

## Pitfalls

❌ **Changelog leaking internal codenames or ticket IDs.** "Fixed Heron regression (XP-431)" means nothing to a user and exposes internal naming. Strip codenames, JIRA/Linear keys, and service names before publishing.

❌ **Over-claiming performance.** "Dashboards now load 10× faster" is a measurable claim. If it's 10× only on a cached p50 and 1.4× at p99 on real data, you have a credibility (and potentially legal) problem. Quote conservative, real numbers ("up to 3× faster") or qualitative phrasing — and only if you can back it.

❌ **Skipping legal review on quantified claims.** Any specific performance, savings, security, or compliance claim ("bank-grade encryption", "saves 5 hours a week", "SOC 2 compliant") should pass legal/compliance review before it's public. Marketing release notes are advertising and are held to advertising standards.

❌ **An inaccessible release-notes page.** The notes page is a real product surface: it needs heading structure, sufficient color contrast, alt text on screenshots, and keyboard navigation (WCAG 2.2 AA). A "what's new" modal that traps focus or has unlabeled close buttons is a regression, not an announcement. Cross-check with the `accessibility` skill.

❌ **Version-number politics.** Bumping to a marketing "v3.0" for a minor release (or refusing to bump for a genuinely breaking change) confuses users and breaks semver expectations for API consumers. Keep the *developer* version honest (semver); the *marketing* name can differ but should never contradict a breaking change.

❌ **Breaking changes buried at the bottom.** "Action required" items are the one thing some users *must* read. Lead with them or pin them — don't hide a migration deadline under three bullets of feature gloss.

## Cross-links

- **`launch-readiness`** — release notes are one deliverable of a launch; the readiness checklist governs whether you should ship at all, and the rollback plan determines whether the notes get *un*published.
- **`storybrand-messaging`** — for the *tone* and the benefit-led framing ("the user is the hero, your feature is the guide"). Use it to convert a technical change into a user-benefit sentence.
- **`accessibility`** — the notes page / "what's new" modal must meet WCAG 2.2 AA like any other surface.
- **`competitive-battlecard`** — major releases often need a battlecard refresh; flag new differentiators to that owner.
