// connectors/test/retry.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withRetry } from '../retry.mjs';

const noSleep = () => Promise.resolve();

test('returns immediately on success (no retry)', async () => {
  let calls = 0;
  const res = await withRetry(() => { calls++; return { status: 200 }; }, { sleep: noSleep });
  assert.equal(res.status, 200);
  assert.equal(calls, 1);
});

test('retries on 429 then succeeds, honoring Retry-After', async () => {
  let calls = 0; const waits = [];
  const res = await withRetry(
    () => { calls++; return calls === 1 ? { status: 429, headers: { get: () => '1' } } : { status: 200 }; },
    { sleep: (ms) => { waits.push(ms); return Promise.resolve(); } },
  );
  assert.equal(res.status, 200);
  assert.equal(calls, 2);
  assert.equal(waits[0], 1000); // Retry-After: 1s honored
});

test('retries a thrown network error then succeeds', async () => {
  let calls = 0;
  const res = await withRetry(() => { calls++; if (calls === 1) throw new Error('ECONNRESET'); return { status: 200 }; }, { sleep: noSleep });
  assert.equal(res.status, 200);
  assert.equal(calls, 2);
});

test('gives up after the retry budget on persistent 429 (returns the 429)', async () => {
  let calls = 0;
  const res = await withRetry(() => { calls++; return { status: 429, headers: { get: () => null } }; }, { retries: 2, sleep: noSleep });
  assert.equal(res.status, 429);
  assert.equal(calls, 3); // initial + 2 retries
});

test('rethrows a persistent network error after the budget', async () => {
  await assert.rejects(() => withRetry(() => { throw new Error('boom'); }, { retries: 1, sleep: noSleep }), /boom/);
});
