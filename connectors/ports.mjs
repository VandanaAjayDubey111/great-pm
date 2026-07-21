// connectors/ports.mjs
// The fixed vocabulary of intents great-pm agents express. Tools and platforms
// slot in beneath this contract; agents never name a tool or a transport.

export const CAPABILITIES = {
  docs:      { read: ['read', 'list'], write: ['write'] },
  comms:     { read: ['listen'],       write: ['post'] },
  tracker:   { read: ['get', 'list'],  write: ['upsert'] },
  analytics: { read: ['query'],        write: [] },
  repo:      { read: ['read'],         write: ['commit'] },
};

export function classify(capability, verb) {
  const cap = CAPABILITIES[capability];
  if (!cap) throw new Error(`unknown capability: ${capability}`);
  if (cap.read.includes(verb)) return 'read';
  if (cap.write.includes(verb)) return 'write';
  throw new Error(`unknown verb '${verb}' for capability '${capability}'`);
}

export const isWrite = (capability, verb) => classify(capability, verb) === 'write';

export function assertImplements(capability, connector) {
  const cap = CAPABILITIES[capability];
  if (!cap) throw new Error(`unknown capability: ${capability}`);
  for (const verb of [...cap.read, ...cap.write]) {
    if (typeof connector[verb] !== 'function') {
      throw new Error(`connector for '${capability}' missing verb '${verb}'`);
    }
  }
  return true;
}
