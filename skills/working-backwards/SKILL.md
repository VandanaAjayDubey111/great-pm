---
name: working-backwards
description: Amazon's Working Backwards / PR-FAQ method — start from the customer problem and desired outcome, write the internal press release + FAQ BEFORE building. Use when defining a new product or major feature, evaluating competing ideas, aligning stakeholders, or forcing clarity on a vague concept before committing engineering resources.
when_to_use: |
  Use to pressure-test whether an idea is worth building — if you can't write a
  compelling press release, you don't have a compelling product. Primarily for
  the gtm-strategist agent; the resulting PR/FAQ also seeds spec-writer's PRD
  framing. NOT for incremental optimization (A/B tests, bug fixes).
allowed-tools: Read, Write
---

> **Provenance.** Adapted from `pmprompt/claude-plugin-product-management@working-backwards`
> (MIT License — github.com/pmprompt/claude-plugin-product-management). Framework
> is Amazon's, documented in *Working Backwards* (Bryar & Carr). Vendored into
> great-pm 2026-05-29 with great-pm-convention frontmatter. MIT permits commercial
> use with attribution; this header is the attribution.

# Working Backwards (PR-FAQ)

## What it is

Amazon's product-development method. The core insight: **start with the customer
problem and work backward to the solution — not the other way around.**

Most teams work forward: "We have this capability — what can we build?" Working
Backwards inverts it: "What problem does the customer have? What's the ideal
solution? Now how do we build it?"

The mechanism: write an internal **press release** and **FAQ** *before* building
anything. If you can't write a compelling press release, you don't have a
compelling product.

> "We took it as an article of faith — if we served customers well… things like
> sales, revenue, and free cash flow would follow." — Jeff Bezos

## When to use it

- Define a new product or major feature before committing resources
- Evaluate competing product ideas and choose which to build
- Align stakeholders on what you're building and why
- Force clarity on vague product concepts
- Prevent building solutions in search of problems
- Create a shared vision engineering/design/leadership can rally around
- Decide whether an idea is worth pursuing at all

## When NOT to use it

- Incremental optimization (A/B tests, bug fixes)
- Executing on an already-defined product
- Scope too small to warrant the overhead

## The artifact — structure

**Press release (1 page, written as if launched):**
- Headline — the customer-facing product name + benefit in one line
- Sub-headline — who it's for and the payoff
- Problem paragraph — the customer pain, in their words
- Solution paragraph — how the product solves it, plainly
- Internal quote — a leader on why this matters
- Customer quote — a representative user reacting (the G5-style moment)
- Call to action — how the customer gets started

**FAQ (the hard part):**
- Customer FAQ — what a user would ask (price, privacy, how it works, edge cases)
- Internal/stakeholder FAQ — the uncomfortable questions: why now, why us, what's
  the riskiest assumption, what could kill this, what's explicitly out of scope,
  what does success look like numerically

## Process

1. State the customer and the problem in their language.
2. Draft the press release as-if-launched. If it's not compelling, stop — fix the
   idea, not the prose.
3. Write the customer FAQ.
4. Write the internal FAQ — surface and answer the riskiest assumptions.
5. List open risks and the validation needed before committing.

## Resources

- *Working Backwards* — Colin Bryar & Bill Carr
- *The Everything Store* — Brad Stone
