---
name: connectors
description: "How great-pm agents read and write external tools (Notion, Slack, Linear, Jira, analytics) through the model-agnostic connector layer — the same way on every AI platform."
---

## Codex host binding

- Treat references to Claude slash workflows as the equivalently named Codex skill.
- Before delegating to any specialist, read the `great-pm-runtime` skill and the selected packaged role file.
- Treat "invoke", "assign", "delegate", "spawn", and source Agent-tool instructions as a required Codex `spawn_agent` call with that role and a bounded assignment.
- Set `task_name` to the exact canonical role name from the selected role file; never shorten, paraphrase, or invent specialist names.
- Store every returned agent identifier. Never call a wait tool until a spawn has returned an identifier, and wait only on identifiers returned by successful spawns.
- If `spawn_agent` is unavailable or a spawn fails, report BLOCKED; do not impersonate the specialist or wait on an empty agent set.
- Resolve bundled paths from the installed GreatPM plugin root.
- Ignore Claude-only model aliases, colors, turn limits, and tool allowlists.
- Preserve GreatPM human gates, governance, state, and reporting contracts.


# Using connectors

great-pm reaches external tools through one neutral command — identical on every AI platform:

```
great-pm connect <capability> <verb> --json '<payload>'
```

## Your capabilities

Your agent frontmatter lists a `capabilities:` field — the connectors you are wired to use.
Only call verbs within those capabilities. If it is empty, you have no external connectors —
keep writing to `.great-pm/` files as usual.

| Capability | Verbs | Example |
|---|---|---|
| `docs` | read · list · write | `great-pm connect docs write --json '{"title":"Q3 Roadmap","body":"# Now\n- ship it"}'` |
| `comms` | post · listen | `great-pm connect comms post --json '{"text":"gate:strategy approved"}'` |
| `tracker` | get · list · upsert | `great-pm connect tracker upsert --json '{"title":"Spec ready","body":"..."}'` |
| `analytics` | query | `great-pm connect analytics query --json '{"metric":"active_users","window":{"start":"2026-01-01","end":"2026-01-31"}}'` |

## Rules

- **Writes are governed.** Per the user's `connectors.json` write mode (`auto`/`gate`/`ask`), a
  write may execute immediately or come back as `{"status":"proposed"}` for the human to approve.
  **Never assume a write happened — check the returned `status`.**
- **Reads are free.** `read` / `list` / `listen` / `query` always execute.
- **Tracker conflicts.** An `upsert` may return `{"conflict":true, local, remote}` with both
  versions + timestamps. **Surface it to the human; never force-overwrite.**
- **Destructive actions always ask**, regardless of mode.
- You choose the **intent**, not the tool. Which tool backs each capability (Notion vs. Linear vs. …)
  and where it writes is configured by the user in `.great-pm/connectors.json`.
