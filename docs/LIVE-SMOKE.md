# Live-smoke a connector (optional real-API verification)

great-pm's automated suite is **token-free** — every connector is tested against a stub
*and* doc-audited against the official API. These live smokes are the **optional final
confirmation** against the real API. Run one per tool whenever you have its token; you
don't need all of them.

## Setup (once, in a throwaway project)

```bash
mkdir -p ~/gp-smoke/.great-pm && cd ~/gp-smoke
# store the token for the tool you're testing (writes .great-pm/secrets.env, gitignored)
great-pm connect setup <tool> --token <YOUR_TOKEN>
# point a capability at the tool (write:auto so the smoke actually exercises a write)
cat > .great-pm/connectors.json   # paste the per-tool block below, then Ctrl-D
```

**Always run the READ first** — it's free and confirms access. A `{"status":"done"}` means
the connection + token + permissions are good. Writes create real objects — delete them after.

---

## Notion — `docs`
```json
{ "docs": { "tool": "notion", "write": "auto", "parent": "<page-id>" } }
```
```bash
great-pm connect docs read  --json '{"id":"<page-id>"}'                       # verify access
great-pm connect docs write --json '{"title":"gp smoke","body":"# It works\n- via great-pm"}'
```
Expect: `read` → `status:done`; `write` → `status:done` + a `result.url` → open it; a new sub-page appears.

## Confluence — `docs`
```json
{ "docs": { "tool": "confluence", "write": "auto", "site": "<site>", "email": "<you@co>", "space": "<numeric-space-id>" } }
```
```bash
great-pm connect docs read  --json '{"id":"<page-id>"}'
great-pm connect docs write --json '{"title":"gp smoke","body":"# It works\n- via great-pm"}'
```
Expect: a new page in the space; `result.url` opens it. (If you get a numeric-space-id error, fetch the id per `CONNECTORS.md`.)

## Slack — `comms`
```json
{ "comms": { "tool": "slack", "write": "auto", "channel": "<channel-id>" } }
```
```bash
great-pm connect comms listen --json '{"limit":3}'                  # read recent (free)
great-pm connect comms post   --json '{"text":"great-pm smoke ✅"}'  # posts to the channel
```
Expect: `listen` → `status:done` with `result.messages`; `post` → a message in the channel. (Bot must be invited to the channel.)

## Linear — `tracker`
```json
{ "tracker": { "tool": "linear", "write": "auto", "team": "<team-id>" } }
```
```bash
great-pm connect tracker list   --json '{}'                         # list issues (free)
great-pm connect tracker upsert --json '{"title":"gp smoke"}'       # creates an issue
```
Expect: `list` → `status:done` with `result.items`; `upsert` → a new issue (`result.url`).

## Jira — `tracker`
```json
{ "tracker": { "tool": "jira", "write": "auto", "site": "<site>", "email": "<you@co>", "project": "<KEY>" } }
```
```bash
great-pm connect tracker list   --json '{}'
great-pm connect tracker upsert --json '{"title":"gp smoke","body":"via great-pm"}'
```
Expect: `list` → issues (via the current `/search/jql` endpoint); `upsert` → a new issue (`result.url`). If create fails on issue type, add `"issuetype":"Story"` (or your project's type) to the config.

## Amplitude — `analytics` (read-only, no cleanup)
```json
{ "analytics": { "tool": "amplitude", "dataCenter": "us" } }
```
```bash
great-pm connect analytics query --json '{"metric":"active_users","window":{"start":"2026-01-01","end":"2026-01-31"}}'
```
Expect: `status:done` with `result.series` (date/value pairs). EU org? set `"dataCenter":"eu"`.

## CSV — `analytics` (no token)
```json
{ "analytics": { "tool": "csv", "path": "metrics.csv" } }
```
```bash
printf 'date,active_users\n2026-01-01,42\n' > metrics.csv
great-pm connect analytics query --json '{"metric":"active_users"}'
```
Expect: `status:done` with `result.series` = `[{date:"2026-01-01",value:42}]`.

---

When you're done: `rm -rf ~/gp-smoke` and delete any test issues/pages/messages created.
