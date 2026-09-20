// connectors/test/tracker-conflict.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkConflict } from '../tracker-conflict.mjs';

test('no conflict for a brand-new issue (no baseUpdatedAt)', () => {
  assert.equal(checkConflict({ local: { title: 'x' }, remote: { updatedAt: '2026-01-01' } }), null);
});

test('no conflict when remote has not changed since base', () => {
  const r = checkConflict({
    local: { title: 'mine' },
    remote: { id: 'I1', updatedAt: '2026-01-01T00:00:00Z' },
    baseUpdatedAt: '2026-01-01T00:00:00Z',
  });
  assert.equal(r, null);
});

test('conflict when remote is newer than base — returns both versions + timestamps', () => {
  const r = checkConflict({
    local: { title: 'mine' },
    remote: { id: 'I1', title: 'theirs', updatedAt: '2026-03-01T00:00:00Z' },
    baseUpdatedAt: '2026-01-01T00:00:00Z',
  });
  assert.equal(r.conflict, true);
  assert.equal(r.local.title, 'mine');
  assert.equal(r.local.basedOn, '2026-01-01T00:00:00Z');
  assert.equal(r.remote.title, 'theirs');
  assert.equal(r.remote.updatedAt, '2026-03-01T00:00:00Z');
});
