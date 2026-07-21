// adapters/gemini/adapter.mjs
// The Gemini platform adapter for the Seam. Third host, same proof: the SAME
// connector engine + governor + connectors, reached through Gemini function-calling.
// Gemini differs from OpenAI in shape — function *declarations*, an object `args`,
// and structured (not stringified) function responses — but the engine is identical.
import { run } from '../../connectors/cli.mjs';

export const name = 'gemini';

// The single generic function declaration — mirrors `great-pm connect <cap> <verb>`.
export function toolSpec() {
  return {
    name: 'great_pm_connect',
    description:
      'Read or write an external tool (Notion/Slack/Linear/Jira/analytics) through great-pm. Writes are governed (auto/gate/ask) and logged.',
    parameters: {
      type: 'OBJECT',
      properties: {
        capability: { type: 'STRING', enum: ['docs', 'comms', 'tracker', 'analytics', 'repo'] },
        verb: { type: 'STRING', description: 'e.g. read, list, write, post, upsert, query, commit' },
        payload: { type: 'OBJECT', description: 'the verb arguments (object). Field names by verb — docs.write: {title, body}; comms.post: {text}; tracker.upsert: {title, body}; analytics.query: {metric}; reads/get: {id}.' },
      },
      required: ['capability', 'verb'],
    },
  };
}

// job ① (translate agents): capabilities -> Gemini `tools` (a function_declarations group).
export function capabilityGrants(capabilities = []) {
  return capabilities.length ? [{ function_declarations: [toolSpec()] }] : [];
}

// job ② (bind interface): execute a Gemini functionCall against the connector engine.
// Gemini returns { name, args } where args is already a structured object.
export async function handleFunctionCall(call, opts = {}) {
  if (call?.name !== 'great_pm_connect') throw new Error(`unknown tool '${call?.name}'`);
  const { capability, verb, payload = {} } = call.args || {};
  // Gemini function responses are structured objects (not strings, unlike OpenAI).
  return run([capability, verb, '--json', JSON.stringify(payload)], opts);
}
