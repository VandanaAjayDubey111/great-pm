// connectors/governor.mjs
import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { isWrite } from './ports.mjs';

const PROTECTED_BRANCHES = new Set(['main', 'master']);

// Trusted policy: ops that are ALWAYS destructive (delete/overwrite/force) and must
// always ask, regardless of mode — and regardless of whether the caller declared it.
// This closes the "caller self-declares destructiveness" trust gap: destructiveness
// is governed here (trusted), not taken on the agent's word. (Seeded for the verbs
// that will exist; the payload `destructive` flag below can only ADD caution.)
const DESTRUCTIVE_OPS = new Set(['docs:delete', 'tracker:delete', 'repo:force-push']);

// decide(req) -> { decision: 'allow' | 'propose', reason }
//   req: { capability, verb, payload?, mode? }
//   'allow'   = execute the write now
//   'propose' = do NOT execute; hand a proposal to a gate runner / human
export function decide(req) {
  const { capability, verb, payload = {}, mode = 'auto' } = req;

  // safety floor #4 (trusted) — always-destructive ops always ask (checked before
  // isWrite so an unknown-but-destructive verb can't slip through)
  if (DESTRUCTIVE_OPS.has(`${capability}:${verb}`)) return { decision: 'propose', reason: 'destructive op always asks' };

  if (!isWrite(capability, verb)) return { decision: 'allow', reason: 'read' };

  // safety floor #5 — kill-switch
  if (process.env.GREATPM_WRITES === 'off') return { decision: 'propose', reason: 'kill-switch: GREATPM_WRITES=off' };

  // safety floor #4 (caller hint) — a declared-destructive write always asks
  if (payload.destructive === true) return { decision: 'propose', reason: 'destructive write always asks' };

  // safety floor #6 — protected-branch guard for repo commits
  if (capability === 'repo' && verb === 'commit' && PROTECTED_BRANCHES.has(payload.branch)) {
    return { decision: 'propose', reason: `protected branch '${payload.branch}' always asks` };
  }

  // write-autonomy mode
  if (mode === 'auto') return { decision: 'allow', reason: 'auto' };
  return { decision: 'propose', reason: mode }; // 'gate' and 'ask' both defer
}

// Defensive secret-scrub so a token can never leak into the audit log.
const SECRET_RE = /(sk-[a-zA-Z0-9]{16,}|ghp_[a-zA-Z0-9]{16,}|xox[baprs]-[A-Za-z0-9-]{10,}|ntn_[A-Za-z0-9]{16,}|secret_[A-Za-z0-9]{16,}|AKIA[0-9A-Z]{16})/g;

// audit(entry, projectDir) — append-only JSON-lines log (safety floor #1), secrets redacted.
export function audit(entry, projectDir) {
  const dir = join(projectDir, '.great-pm', 'connectors');
  mkdirSync(dir, { recursive: true });
  const line = JSON.stringify({ ts: new Date().toISOString(), ...entry }).replace(SECRET_RE, '[REDACTED]');
  appendFileSync(join(dir, 'audit.log'), line + '\n');
}
