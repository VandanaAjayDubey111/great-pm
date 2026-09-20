// connectors/tracker-conflict.mjs
// Shared conflict detection for two-way tracker connectors (Linear, Jira).
// Policy (per the user's decision): great-pm NEVER auto-resolves a conflict.
// If the remote issue changed since great-pm last synced (remote.updatedAt is
// newer than the baseUpdatedAt the caller passed), we do NOT overwrite — we
// return both versions, with timestamps, for the human to decide.

export function checkConflict({ local, remote, baseUpdatedAt } = {}) {
  if (!remote || !remote.updatedAt || !baseUpdatedAt) return null; // new issue / no baseline → no conflict
  if (new Date(remote.updatedAt).getTime() > new Date(baseUpdatedAt).getTime()) {
    return {
      conflict: true,
      reason: 'remote changed since you last synced — choose which version to keep',
      local: { ...local, basedOn: baseUpdatedAt },
      remote: {
        id: remote.id,
        title: remote.title,
        body: remote.body,
        status: remote.status,
        updatedAt: remote.updatedAt,
      },
    };
  }
  return null;
}
