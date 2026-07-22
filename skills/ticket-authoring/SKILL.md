---
name: ticket-authoring
description: Playbook for change tickets — the format that makes a work item buildable and traceable; outcome title, why, scope, acceptance criteria, dependencies, evidence links. The upstream contract that pr-authoring's PR closes against.
when_to_use: |
  Use when creating or grooming any change ticket (Beads issue, Linear/Jira
  ticket) — especially when decomposing an approved PRD into build work.
  Pairs with pr-authoring: the ticket's acceptance criteria become the PR's
  acceptance-evidence rows.
allowed-tools: Read, Write
---

# Ticket Authoring — playbook

A ticket is the smallest contract in the chain. The full thread runs:

**PRD story → ticket → PR → review → merge → deploy**

Each link closes against the previous one: the ticket's acceptance criteria
come from a PRD story, and the PR's acceptance-evidence table proves the
ticket's criteria. A ticket that can't be traced backward to a PRD story or
forward to a PR is an orphan — orphans become scope creep.

## 1. Required fields

1. **Title** — the outcome, not the activity. "Define product requirements
   and user journeys", never "Work on docs".
2. **Why** — the gap this closes, with a link to the upstream artifact
   (PRD story ID, strategy decision, Discover signal).
3. **What (scope of THIS ticket)** — the single deliverable and its
   boundaries. One deliverable per ticket.
4. **Out of scope** — explicitly, even when it feels obvious.
5. **Acceptance criteria** — yes/no checkable. These are the SAME criteria
   the closing PR must evidence, row for row.
6. **Dependencies** — what must land first (`bd dep`), and what this ticket
   blocks. A silent dependency is a future stall.
7. **Type / Priority / Labels** — `bd` conventions: type task|bug|feature,
   priority P0–P4, stage label (`stage-define`, `open-decision`, …).
8. **Evidence links** — the Discover signal, PRD section, or decision ID
   this traces to.

## 2. Definition of Ready

A ticket may enter "ready" ONLY when every field above is filled. A ticket
without acceptance criteria is a conversation, not a work item.

## 3. Sizing rule

If the ticket cannot close with ONE reviewable PR, split it. "And" in a
title ("build X and migrate Y") is the tell.

## 4. Blocked tickets

State the block explicitly per the `done-blocked` contract: what was tried,
why it failed, what is needed. "Blocked" with no need named is abandoned,
not blocked.

## 5. Anti-patterns — ban these

- **Activity titles** — "Investigate", "Work on", "Continue" describe
  motion, not an outcome to verify.
- **"And" tickets** — two deliverables means two tickets.
- **Missing acceptance criteria** — nothing to close against; the closing
  PR will define success after the fact.
- **Orphan tickets** — no upstream trace; where did this scope come from?
- **Silent dependencies** — the stall you discover mid-build.

## 6. Output shape

A ticket a builder can claim without asking "what does done look like?",
and whose closing PR can copy the acceptance criteria straight into its
evidence table. If the builder asks what done means, the ticket failed.
