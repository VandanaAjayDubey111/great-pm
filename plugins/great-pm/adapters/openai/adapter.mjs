// adapters/openai/adapter.mjs
// The OpenAI platform adapter for the Seam. Proves portability: the SAME connector
// engine + governor + connectors are reached through OpenAI function-calling instead
// of Claude's Bash tool. Only this adapter differs from claude/ — the engine is shared.
import { run } from '../../connectors/cli.mjs';

export const name = 'openai';

// The single generic function the model is given — mirrors `great-pm connect <cap> <verb>`.
export function toolSpec() {
  return {
    type: 'function',
    function: {
      name: 'great_pm_connect',
      description:
        'Read or write an external tool (Notion/Slack/Linear/Jira/analytics) through great-pm. Writes are governed (auto/gate/ask) and logged.',
      parameters: {
        type: 'object',
        properties: {
          capability: { type: 'string', enum: ['docs', 'comms', 'tracker', 'analytics', 'repo'] },
          verb: { type: 'string', description: 'e.g. read, list, write, post, upsert, query, commit' },
          payload: { type: 'object', description: 'the verb arguments (object). Field names by verb — docs.write: {title, body}; comms.post: {text}; tracker.upsert: {title, body}; analytics.query: {metric}; reads/get: {id}.' },
        },
        required: ['capability', 'verb'],
      },
    },
  };
}

// job ① (translate agents): capabilities -> the OpenAI tools an agent needs.
// Every capability uses the one generic tool, so the grant is uniform (like Claude's).
export function capabilityGrants(capabilities = []) {
  return capabilities.length ? [toolSpec()] : [];
}

// job ② (bind interface): execute an OpenAI tool call against the connector engine.
// `call` is an OpenAI tool call — { name, arguments } or { function: { name, arguments } },
// where arguments is a JSON string (or already-parsed object).
export async function handleToolCall(call, opts = {}) {
  const fn = call.function || call;
  if (fn.name !== 'great_pm_connect') throw new Error(`unknown tool '${fn.name}'`);
  const args = typeof fn.arguments === 'string' ? JSON.parse(fn.arguments) : (fn.arguments || {});
  const { capability, verb, payload = {} } = args;
  const result = await run([capability, verb, '--json', JSON.stringify(payload)], opts);
  return JSON.stringify(result); // OpenAI tool results are returned to the model as strings
}
