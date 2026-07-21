---
description: Show who owns what across initiatives, gates, drafts, and Beads issues. Surfaces orphaned artefacts (no owner) and over-loaded owners.
argument-hint: "[--initiative=<slug>] [--orphans-only]"
user-invocable: true
allowed-tools: Read, Bash
model: opus
---

You are the great-pm `/pm-ownership` command. Build an ownership map.

## Parse arguments

- **`--initiative=<slug>`** → scope the map to a single initiative.
- **`--orphans-only`** → only print artefacts with no owner.
- (no flag) → full ownership map across the whole product.

## Pre-flight

```bash
echo "cwd=$(pwd)"
ls .great-pm/PROJECT.md 2>/dev/null && echo "PROJECT_OK" || echo "NO_PROJECT"
```

If `NO_PROJECT` → BLOCKED.

## Operating procedure

0. **Step 0 — refine the user's query** (transparent Mode B). Invoke
   `query-refiner-pm` with `$ARGUMENTS`. The refiner returns:
   ```
   You typed:  <original>

   Refined to: <refined brief>

   What changed: <one line>

   Proceeding with refined. Reply "use original" to override.
   ```
   Use the **refined** version as the brief for subsequent steps UNLESS
   the user replies "use original". Log the refinement to
   `.great-pm/refinements/$(date +%Y-%m-%d).log`. This wiring is
   universal across great-pm commands per the gate-policy: explicit
   discipline — you make the user's leverage visible while preserving
   their ability to override.

1. Read `.great-pm/PROJECT.md` and parse the "Active initiatives" block —
   each row should have an `owner:` field.

2. List all drafts in `.great-pm/drafts/` — each markdown file should have a
   front-matter `owner:` or `author:` field. Files without one are
   **orphans**.

3. List open gates: `bd list --label gate --status open` — each Beads
   issue has an assignee.

4. Compile the map:

   ```
   == Ownership map ==

   Initiative: <slug>
     Owner: <name>
     Stage: <discover|strategize|prioritize|define|launch|measure>
     Drafts:
       - <draft-1>  (owner: <name>)
       - <draft-2>  (orphan)
     Gates:
       - bd-<id>  gate:<type>  assignee: <name>
   ```

5. End with a summary line:
   ```
   <I> initiatives | <D> drafts (<O> orphans) | <G> open gates | <U> distinct owners
   Over-loaded: <name> (owns <N> artefacts)
   ```

6. If `--orphans-only`, print only the orphan rows.

## Reporting

- **DONE**: `DONE: /pm-ownership — <I> initiatives, <D> drafts (<O> orphans), <G> gates mapped.`
- **BLOCKED**: missing PROJECT.md / Beads unavailable. tried + failed_because + need.

## Notes

- Ownership is metadata. If a draft has no `owner:` field, that's not a
  silent bug — surface it so the user assigns it.
- "Over-loaded" warning fires when one person owns >3 in-flight artefacts.
