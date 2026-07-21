// connectors/retry.mjs
// Shared resilience for connectors: retry on HTTP 429 (honoring Retry-After) and
// on transient network errors, with exponential backoff. `sleep` is injectable so
// tests run instantly. Wraps a function that returns a fetch Response.
export async function withRetry(fn, { retries = 3, sleep = (ms) => new Promise((r) => setTimeout(r, ms)), onRetry } = {}) {
  let attempt = 0;
  for (;;) {
    let res;
    try {
      res = await fn();
    } catch (e) {
      if (attempt >= retries) throw e;
      attempt++;
      const wait = 2 ** attempt * 100;
      onRetry?.({ attempt, reason: e.message, waitMs: wait });
      await sleep(wait);
      continue;
    }
    if (res && (res.status === 429 || res.status === 529) && attempt < retries) {
      attempt++;
      const retryAfter = Number(res.headers?.get?.('retry-after'));
      const wait = (Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 2 ** attempt) * 1000;
      onRetry?.({ attempt, reason: String(res.status), waitMs: wait });
      await sleep(wait);
      continue;
    }
    return res;
  }
}
