---
name: connectors
description: How great-pm agents read and write external tools (Notion, Slack, Linear, Jira, analytics) through the model-agnostic connector layer — the same way on every AI platform.
---

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
