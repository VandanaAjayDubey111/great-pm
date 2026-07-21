# The Seam — great-pm's model-agnostic integration layer

> **Status:** Draft / proposed — 2026-06-24. Approved in design; implementation plan pending.
> **Scope:** Piece A of the "Connected, model-agnostic great-pm" program (see [Build order](#build-order)).

## Why this exists

great-pm needs two things it doesn't have yet, and they are the same problem wearing two hats:

1. **A proper filing system** — its outputs (gate decisions, roadmaps, specs, backlogs) should land in the tools teams actually live in: Notion, Slack, Linear, Jira — read *and* write (two-way).
2. **Real product analytics** — the Measure stage should pull live numbers (Amplitude, CSV/warehouse) instead of reasoning about pasted data.

Both are *"connect great-pm to an outside tool."* And great-pm must run on **any** model host — Claude Code today, OpenAI / Gemini / Codex next. If integrations are wired to one host's native connectors, they don't travel — you rebuild them per platform.

**The Seam is the layer that makes integrations portable by construction.** Build it once; every new platform is a thin adapter, not a rewrite.

## The model

```
  great-pm agents  (portable prompts: "file this", "post this", "fetch retention")
         │
         ▼
  ① CAPABILITY PORTS   ← the fixed vocabulary of intents (never changes per tool/platform)
         │
         ▼
  ② CONNECTOR ENGINE   ← one Node module; speaks each tool's own public API; written ONCE
         │
         ▼
  ③ NEUTRAL INTERFACE  ← every AI platform calls the engine the SAME way
         │
         ▼
   Notion · Slack · Linear · Jira · Amplitude · (beads, files)
```

The only part that is ever rebuilt per platform is **④ the adapter**, and it is deliberately thin.

## ① Capability Ports — the vocabulary

Agents speak only these verbs. They never name a tool ("Notion") or a transport ("the Claude Notion connector"). That ignorance is what makes them portable.

| Capability | Verbs | Backed by |
|---|---|---|
| `docs` | `write` · `read` · `list` | Notion |
| `comms` | `post` · `listen` | Slack |
| `tracker` | `upsert` · `list` · `get` | Linear / Jira (beads = default) |
| `analytics` | `query` (read-only) | Amplitude / CSV |
| `repo` | `commit` · `read` | Git (a git-backed destination) |
| `fs` | `read` · `write` | `.great-pm/` files (already portable) |
| `tasks` | `create` · `update` · `close` | beads (already portable) |

This contract is stable. New tools and new platforms slot in **underneath** it without changing what agents say.

## ② The Connector Engine

A `connectors/` module in great-pm — **zero-dependency Node** (stdlib `fetch`), matching the board's style. One small file per tool, each implementing the capability verbs against that tool's **public API**:

```
connectors/
  notion.mjs      → docs.*      (Notion REST)
  slack.mjs       → comms.*     (Slack Web API)
  linear.mjs      → tracker.*   (Linear GraphQL)
  jira.mjs        → tracker.*   (Jira REST)
  amplitude.mjs   → analytics.* (Amplitude HTTP)
  csv.mjs         → analytics.* (CSV / warehouse export — the universal fallback)
  registry.mjs    → maps capability → configured tool
```

A per-project `.great-pm/connectors.json` maps capability → tool and holds each connector's settings (destination, write mode):

```json
{
  "docs":      { "tool": "notion",    "write": "auto" },
  "comms":     { "tool": "slack",     "write": "auto" },
  "tracker":   { "tool": "linear",    "write": "gate" },
  "repo":      { "tool": "git",       "write": "auto" },
  "analytics": { "tool": "amplitude", "read":  true   }
}
```

Because the engine talks to each tool's **own** API (plain HTTPS), it is **identical on every platform** — this is the part that is *not* rebuilt per host.

## ③ The Neutral Interface

Every platform reaches the engine the same way, through one entrypoint:

```
great-pm connect <capability> <verb> --json '<payload>'   →   JSON on stdout
# e.g.
great-pm connect docs write --json '{ "title": "Q3 Roadmap", "body": "..." }'
```

- On **Claude Code**: a single `Bash(great-pm connect:*)` tool grant.
- On **OpenAI / Gemini / Codex**: the platform adapter exposes that same command as a function/tool.
- For hosts that can't shell out: the same handlers are reachable over **local HTTP** via the existing board server.

Same call shape, same payloads, everywhere.

## ④ The Platform Adapter Contract

The thin translator each host needs. Building one (pieces B / F / G) is four jobs:

1. **Translate agents** — render great-pm's portable agent files into the host's native agent format (its frontmatter, its tool declarations).
2. **Bind the interface** — wire the neutral `great-pm connect …` call into the host's tool-calling.
3. **Bind lifecycle** — map great-pm's hooks (session start, context handoff) to the host's equivalents, or a harmless no-op where the host has none.
4. **Pass secrets** — hand the engine its API keys.

Everything heavy — integration logic, agent prose, the 6-stage loop — is **shared**. A new adapter is small and mostly mechanical.

## ⑤ The Portable Agent Format

Today an agent's frontmatter carries Claude-only knobs (`model: opus` — an alias that always resolves to the newest Opus — and Claude tool names). We split it:

```yaml
# portable core — every platform reads this
name: spec-writer
description: ...
capabilities: [docs, tracker]      # NOT tool names
skills: [beads]

# Claude-only knobs — only the Claude adapter reads this
claude:
  model: opus
  maxTurns: 35
  tools: [Read, Write, Glob, Grep, "Bash(bd:*)"]
```

Agents declare **capabilities, not tool names**; each adapter expands `capabilities: [docs]` into that host's concrete tool grants. Migrating the agent roster is a **one-time scripted pass**, done once — not per platform.

## ⑥ Secrets & Write Autonomy

### Connecting tools & secrets
Users connect each tool by **bringing their own token** — generated in that tool's own settings and pasted once into a **gitignored** `.great-pm/secrets.env`. A guided `great-pm connect setup <tool>` wizard deep-links to each tool's token page and validates the token immediately. Tokens are loaded from the environment and **fail loud if missing** — never hardcoded. (Matches great-pm's existing secrets rule.)

This keeps great-pm **zero-backend and identical on every platform** — connecting is just environment variables, with no hosted login server. OAuth (a one-click "Connect" button) is a later, opt-in upgrade for the tools where it pays off; it is deliberately **not** a launch dependency, because a hosted OAuth callback would break the runs-anywhere property this whole layer protects.

### Write autonomy — the user chooses
Two-way writes touch the outside world, so the user controls how autonomous great-pm is, **per connector**, with three levels:

| Mode | Behavior | For |
|---|---|---|
| 🟢 `auto` | great-pm files / posts / commits on its own, no prompt | Most users — "just do it in my workspace" |
| 🟡 `gate` | Writes happen at great-pm's natural checkpoints (gate approvals / digest), shown as a summary | A glance, not control of each one |
| 🔴 `ask` | Propose every write, approve each | Max control / shared or sensitive destinations |

**Default (public):** `ask`. For a brand-new adopter pointing great-pm at their *real* tools, nothing writes to an external tool without explicit approval. The setup wizard lets them raise a connector to `gate` or `auto` once they trust it. (An `auto`-by-default is fine for a single owner; `ask` is the safe posture for the world.)

### The safety floor — always on, in every mode
1. **Audit log** — every external write recorded (what, where, when, which agent).
2. **Reversible** — the created object's id is stored, so a post/page/issue can be undone or updated.
3. **Scoped** — only the destinations the user connected; it can't wander.
4. **Destructive-always-asks** — deleting or overwriting existing external content prompts regardless of mode. `auto` covers *create / append / update-your-own-draft*; it never silently destroys data.
5. **Kill-switch** — `GREATPM_WRITES=off` forces everything back to `ask`.
6. **Protected-branch guard (`repo`)** — auto git commits go only to a great-pm-scoped branch/path; **committing or pushing to the default/shared branch (`main`/`master`) always asks**, regardless of mode.

Reads are always free; only writes are governed.

## What's portable vs platform-specific

| Portable (written once) | Platform-specific (the thin adapter) |
|---|---|
| Agent / skill / command prose | Agent frontmatter translation |
| The 6-stage loop logic | Tool-calling binding for `great-pm connect` |
| ① Capability ports | Lifecycle / hooks mapping |
| ② Connector engine (all tool APIs) | Secret injection |
| ③ Neutral interface contract | — |
| ⑥ Write-autonomy + safety logic | — |

## Build order

The Seam (this doc) is piece **A** of the larger program:

1. **A · The Seam** — this layer. *(designed)*
2. **B · Claude adapter** — make the seam real where great-pm runs today.
3. **C-slim · Notion two-way** — the first real integration, end-to-end on Claude (a working vertical slice).
4. **F · One more platform (OpenAI / Codex)** — port the slice (Seam + Notion). The moment of truth for "runs anywhere."
5. **Widen** (mostly parallel, low-risk, repeating a proven pattern):
   - Slack two-way · Linear + Jira two-way (incl. the "beads vs. tracker, who wins" conflict rule)
   - Analytics into the Measure stage (Amplitude + CSV first)
   - Gemini + Codex adapters

## Open questions (resolved later, not blocking A)

- **Native wrappers (binding option 3):** the engine is built so each host *can later* expose it in native style (an MCP server on Claude, function-tools on OpenAI) for nicer UX. Deferred — the neutral interface ships first.
- **Tracker conflict rule:** when both beads and Linear/Jira hold the same issue, who wins on edit? Decided when piece D (Linear + Jira two-way) is designed.
