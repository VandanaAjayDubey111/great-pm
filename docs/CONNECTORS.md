# Connecting great-pm to your tools

great-pm reaches your tools through the **Seam** — one neutral command, the same on
every AI platform: `great-pm connect <capability> <verb>`. You connect a tool by
**bringing your own token** (BYOT): you create a free integration in that tool, paste
the token in once, and great-pm uses it. There is **no central great-pm service** —
everything runs in your own environment with your own tokens, so it's free to run and
your data never passes through us.

> **All these APIs are free.** You only need an account on each tool (every one has a
> free tier). The only running cost of great-pm is the LLM tokens that power the agents.

> **✅ Live-verified against real APIs (2026-07-02):** **Notion** (REST), **Linear** (GraphQL),
> **Confluence** (REST v2), **Jira** (REST v3, via the current `/search/jql` endpoint), and
> **Slack** (`comms` — GET `conversations.history` read + real `post`) were each proven
> end-to-end against live accounts. Amplitude is doc-audited + stub-tested (read-only;
> live-smoke steps in [`LIVE-SMOKE.md`](LIVE-SMOKE.md)).

> **✅ Cross-platform proven (2026-07-02):** a **non-Claude model** (Llama via Groq) autonomously
> called `great_pm_connect` and **posted to real Slack** through the **OpenAI/Codex adapter** —
> the "runs on any model" path, demonstrated end-to-end. Claude is the native host; the
> OpenAI/Gemini/Codex adapters share this function-calling path.

## How it works

1. Create a token in the tool (links below), then store it with the wizard:
   ```
   great-pm connect setup <tool> --token <YOUR_TOKEN>
   ```
   It's saved to `.great-pm/secrets.env` (gitignored — never committed).
2. Point a capability at that tool in `.great-pm/connectors.json`.
3. That's it — wired agents now read/write it.

### Write safety (important)

Every **write** passes through the governor with a per-connector mode:

| Mode | Behavior |
|---|---|
| `ask` | Propose every write; you approve each. **Default for new setups.** |
| `gate` | Writes batched + shown at great-pm's checkpoints. |
| `auto` | great-pm writes on its own. Opt in once you trust it. |

**Reads are always free.** Destructive actions always ask. A tracker `upsert` that
conflicts with a remote edit returns **both versions** for you to resolve — it never
overwrites. New setups default to **`ask`** so great-pm never surprises you on a real
tool; flip to `auto` per connector when ready.

## Per-tool setup

### Notion — `docs`
- Token: create an integration at <https://www.notion.so/my-integrations> (copy the Internal Integration Secret).
- Access: open the target page → **••• → Connections →** add your integration. Copy the page id (last 32 chars of the URL).
```json
{ "docs": { "tool": "notion", "write": "ask", "parent": "<page-id>" } }
```
Secret: `NOTION_TOKEN`.

### Confluence — `docs`
- Token: create an API token at <https://id.atlassian.com/manage-profile/security/api-tokens>.
- You need your site (`<site>.atlassian.net`), your Atlassian email, and the **numeric** space id.
- ⚠ `space` must be the **numeric** id — *not* the visible space key (e.g. `ENG`). Fetch it: `GET https://<site>.atlassian.net/wiki/api/v2/spaces?keys=<KEY>` → `results[].id`. (great-pm will refuse a non-numeric value with a pointer to this.)
```json
{ "docs": { "tool": "confluence", "write": "ask", "site": "<site>", "email": "<you@co>", "space": "<numeric-space-id>" } }
```
Secret: `CONFLUENCE_TOKEN`.

### Slack — `comms`
- Token: create an app at <https://api.slack.com/apps> → OAuth scopes `chat:write` (post) and `channels:history` (listen; `groups:history` for private channels) → install → copy the Bot token (`xoxb-…`).
- Invite the bot to the channel (required for both post and listen); copy the channel id.
- Note: brand-new non-Marketplace apps are heavily rate-limited on `conversations.history` — great-pm retries, but high-volume listening may lag.
```json
{ "comms": { "tool": "slack", "write": "ask", "channel": "<channel-id>" } }
```
Secret: `SLACK_TOKEN`.

### Linear — `tracker`
- Token: <https://linear.app/settings/api> → create a **personal API key** (must be a personal key, not an OAuth token). Copy your team id.
```json
{ "tracker": { "tool": "linear", "write": "ask", "team": "<team-id>" } }
```
Secret: `LINEAR_TOKEN`.

### Jira — `tracker`
- Token: <https://id.atlassian.com/manage-profile/security/api-tokens>. Need site + email + project key.
- Optional `"issuetype"` (defaults to `Task`) — set it if your project has no "Task" type (e.g. `Story`).
```json
{ "tracker": { "tool": "jira", "write": "ask", "site": "<site>", "email": "<you@co>", "project": "<KEY>", "issuetype": "Task" } }
```
Secret: `JIRA_TOKEN`.

### Amplitude — `analytics` (read-only)
- Keys: project Settings → <https://amplitude.com/settings/projects> (API Key + Secret Key). **Works on the free Starter plan — no paid plan required.**
- EU data residency? add `"dataCenter": "eu"` (defaults to US → `amplitude.com`).
```json
{ "analytics": { "tool": "amplitude", "dataCenter": "us" } }
```
Secrets: `AMPLITUDE_API_KEY`, `AMPLITUDE_SECRET_KEY`.

### CSV — `analytics` (read-only, no token)
- Point at a metrics export with a `date` column + one column per metric.
```json
{ "analytics": { "tool": "csv", "path": "metrics/export.csv" } }
```
A relative `path` is resolved inside your project and may not escape it.

## The PATH command

Agents (and you) call the bare `great-pm` command. The plugin's SessionStart hook
symlinks it into `~/.local/bin` automatically; if that dir isn't on your `PATH`, add it,
or call `$CLAUDE_PLUGIN_ROOT/scripts/great-pm` directly.

## Notes

- Tokens live only in `.great-pm/secrets.env` (gitignored). great-pm never logs them.
- Free APIs throttle; great-pm retries on rate limits and paginates automatically.
- Each capability points at one tool at a time (e.g. `docs` → Notion **or** Confluence).
