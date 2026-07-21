# adapters/ — making the Seam real on each platform

A platform adapter is the thin per-host translator from `../docs/architecture/SEAM.md` ④.
It does four jobs for one AI platform; everything heavy (the connector engine,
agent prose, the 6-stage loop) is shared. `claude/` is the reference adapter.

**Implemented:** `claude/` (native host), `openai/` and `gemini/` (function-calling) — the
non-Claude adapters are the portability proof: the *same* engine + connectors reached through
each host's own tool-calls.

## The contract — what every adapter exports
The two jobs that differ per host are **platform-shaped** — the return *type* depends on the host:

| Export | Job | Claude | OpenAI |
|---|---|---|---|
| `name` | identity | `'claude'` | `'openai'` |
| `capabilityGrants(capabilities)` | ① translate agents | array of grant **strings** (`Bash(great-pm connect:*)`) | array of OpenAI **function specs** (`great_pm_connect`) |
| bind interface | ② run a call | `dispatch(argv)` — CLI routing | `handleToolCall(call)` — function-call handler |
| (lifecycle) | ③ bind lifecycle | map great-pm hooks to the host's equivalents, or no-op | |
| (secrets) | ④ pass secrets | the engine reads `.great-pm/secrets.env` via the registry; the adapter just ensures env reaches it | |

## The Claude adapter (`claude/adapter.mjs`)
Claude is great-pm's native host, so it's thin:
- `capabilityGrants` → `Bash(great-pm connect:*)` — every capability uses the one neutral command.
- `dispatch` → routes `great-pm connect …` and `great-pm setup …` into the engine.
- `scripts/great-pm` is the front door; lifecycle uses Claude's existing hooks; secrets come from `.great-pm/secrets.env`.

> **PATH note:** agents call the bare command `great-pm connect …`. The plugin install
> puts `scripts/great-pm` on PATH (or agents invoke `$CLAUDE_PLUGIN_ROOT/scripts/great-pm`).

## The OpenAI adapter (`openai/adapter.mjs`)
Proves the engine ports off Claude:
- `capabilityGrants` → `[toolSpec()]` — one generic `great_pm_connect(capability, verb, payload)` function the model is given.
- `handleToolCall(call, opts)` → parses the model's tool-call args and runs them through `connectors/cli.mjs`, returning the result as a string (how OpenAI expects tool output).
- The connector engine, governor, and the Notion connector are byte-for-byte the same as on Claude.

## The Gemini adapter (`gemini/adapter.mjs`)
Third host, same engine. Mirrors OpenAI but in Gemini's shape:
- `capabilityGrants` → `[{ function_declarations: [toolSpec()] }]` (Gemini's `tools` form, uppercase `OBJECT`/`STRING` types).
- `handleFunctionCall(call, opts)` → Gemini returns `{ name, args }` with a structured `args`; the result is returned as a structured object (not a string, unlike OpenAI).

## Codex
Codex runs on **OpenAI function-calling**, so it's covered by `openai/adapter.mjs` —
no separate adapter code. To use great-pm from Codex, register the tool from
`capabilityGrants()` and route its calls through `handleToolCall()`. A minimal
`AGENTS.md` snippet:

```md
## Tools
great-pm exposes one tool, `great_pm_connect(capability, verb, payload)` (from
adapters/openai/adapter.mjs → toolSpec()). Route tool calls through handleToolCall().
Writes are governed (auto/gate/ask); reads are free.
```

## Adding an adapter (future hosts)
1. Create `adapters/<platform>/adapter.mjs` exporting `name`, `capabilityGrants`, and the host's run hook (`dispatch` for a CLI host, `handleToolCall` / `handleFunctionCall` for a function-calling host).
2. `capabilityGrants` returns that host's native tool representation for the connect command.
3. The run hook wires the host's tool-call into `connectors/cli.mjs`'s `run()`.
4. Map the host's lifecycle hooks; ensure secrets reach the engine.
5. Add `adapters/test/<platform>.test.mjs`.

The connector engine and the capability contract never change — only this adapter.
