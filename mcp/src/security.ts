export const MAX_REQUEST_BYTES = 256 * 1024;

export interface GreatPmEnv {
  readonly ALLOWED_HOSTS?: string;
  readonly ALLOWED_ORIGINS?: string;
}

const localHostnames = new Set(["localhost", "127.0.0.1", "::1"]);
const publicHostnames = new Set([
  "greatpm-mcp.vandana424-s.workers.dev",
]);

export function guardPublicRequest(
  request: Request,
  env: GreatPmEnv,
): Response | null {
  const requestUrl = new URL(request.url);
  const host = normalizeHostname(
    request.headers.get("host") ?? requestUrl.host,
  );
  const configuredHosts = parseAllowlist(env.ALLOWED_HOSTS);

  if (
    !localHostnames.has(host) &&
    !publicHostnames.has(host) &&
    !configuredHosts.has(host)
  ) {
    return jsonError(403, "Forbidden.");
  }

  const origin = request.headers.get("origin");
  if (origin) {
    const originResult = validateOrigin(
      origin,
      host,
      parseAllowlist(env.ALLOWED_ORIGINS),
    );
    if (!originResult) {
      return jsonError(403, "Forbidden.");
    }
  }

  if (request.method === "POST") {
    const contentLength = request.headers.get("content-length");
    if (contentLength) {
      const declaredBytes = Number(contentLength);
      if (!Number.isSafeInteger(declaredBytes) || declaredBytes < 0) {
        return jsonError(400, "Invalid Content-Length.");
      }
      if (declaredBytes > MAX_REQUEST_BYTES) {
        return jsonError(413, "Request body too large.");
      }
    }
  }

  return null;
}

export async function boundPublicRequestBody(
  request: Request,
): Promise<Request | Response> {
  if (request.method !== "POST" || !request.body) return request;

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_REQUEST_BYTES) {
        await reader.cancel();
        return jsonError(413, "Request body too large.");
      }
      chunks.push(value);
    }
  } catch {
    return jsonError(400, "Invalid request body.");
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body,
    redirect: request.redirect,
  });
}

function validateOrigin(
  value: string,
  requestHost: string,
  configuredOrigins: ReadonlySet<string>,
): boolean {
  try {
    const origin = new URL(value);
    const originHost = normalizeHostname(origin.host);
    const isLocal = localHostnames.has(originHost);

    if (origin.origin === "null" || value !== origin.origin) return false;
    if (!isLocal && origin.protocol !== "https:") return false;
    if (isLocal && !["http:", "https:"].includes(origin.protocol)) {
      return false;
    }

    return (
      isLocal ||
      originHost === requestHost ||
      configuredOrigins.has(originHost)
    );
  } catch {
    return false;
  }
}

function parseAllowlist(value: string | undefined): ReadonlySet<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((entry) => normalizeHostname(entry.trim()))
      .filter(Boolean),
  );
}

function normalizeHostname(host: string): string {
  const normalized = host.toLocaleLowerCase("en").trim();
  if (normalized.startsWith("[")) {
    const closingBracket = normalized.indexOf("]");
    return closingBracket === -1
      ? normalized
      : normalized.slice(1, closingBracket);
  }
  return normalized.split(":")[0];
}

function jsonError(status: number, message: string): Response {
  return Response.json(
    { error: message },
    {
      status,
      headers: { "cache-control": "no-store" },
    },
  );
}
