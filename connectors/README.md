# connectors/ — great-pm's integration Seam

The model-agnostic layer that lets great-pm read/write external tools (Notion,
Slack, Linear, Jira, Amplitude) the same way on every AI platform. See the
architecture in `../docs/architecture/SEAM.md`.

## The contract
A connector implements **every verb** of one capability (`ports.mjs`):

| Capability | Verbs |
|---|---|
| docs | read · list · write |
| comms | listen · post |
| tracker | get · list · upsert |
| analytics | query |
| repo | read · commit |

Each verb is `async (payload) => result`. Validate with `assertImplements(capability, connector)`.

## Adding a real connector
> **Implemented:** `notion.mjs` + `confluence.mjs` (`docs`), `slack.mjs` (`comms`), `linear.mjs` + `jira.mjs` (`tracker`, with a no-overwrite conflict rule in `tracker-conflict.mjs` — on a conflict the connector returns both versions + timestamps for the human, never auto-resolving), and `analytics.mjs` (`analytics`: CSV + Amplitude). All use an injectable `fetch`/path (token-free tests), retry on 429/network (`retry.mjs`), and paginate. `notion.mjs` is the reference.
>
> **Adopter setup guide:** [`docs/CONNECTORS.md`](../docs/CONNECTORS.md) — per-tool tokens, scopes, and `connectors.json` config.

1. Create `connectors/<tool>.mjs` implementing the verbs against the tool's public API.
2. Read its token via `requireSecret(secrets, '<TOOL>_TOKEN')` — never hardcode.
3. Register it in `resolveConnector()` in `cli.mjs`.
4. Add its token URL to `TOKEN_URLS` in `setup.mjs`.
5. Add a test file under `connectors/test/`.

## The neutral interface
```
great-pm connect <capability> <verb> --json '<payload>'    # CLI (scripts/great-pm-connect)
POST /api/connect { capability, verb, payload, projectDir } # HTTP (board server)
```

## Governance
All writes pass through `governor.decide()`: write-autonomy (`auto`/`gate`/`ask`) +
the safety floor (audit log, reversible, destructive-always-asks, protected-branch
guard, kill-switch). Reads are free. Never bypass the governor.

## Config
`.great-pm/connectors.json` maps each capability to a tool + write mode:
```json
{ "docs": { "tool": "notion", "write": "auto" } }
```
Tokens live in the gitignored `.great-pm/secrets.env`.
