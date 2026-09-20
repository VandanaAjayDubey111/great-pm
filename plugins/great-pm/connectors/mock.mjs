// connectors/mock.mjs
import { CAPABILITIES } from './ports.mjs';

// A fake connector: every verb echoes its input. Lets the engine be tested
// end-to-end with no real API or token. Real connectors land in pieces C/D/E.
export function mockConnector(capability) {
  const cap = CAPABILITIES[capability];
  if (!cap) throw new Error(`unknown capability: ${capability}`);
  const conn = {};
  for (const verb of [...cap.read, ...cap.write]) {
    conn[verb] = async (payload = {}) => ({ ok: true, capability, verb, echo: payload, tool: 'mock' });
  }
  return conn;
}
