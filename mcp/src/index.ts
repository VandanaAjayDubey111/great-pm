import { createMcpHandler } from "@modelcontextprotocol/server";
import {
  guardPublicRequest,
  type GreatPmEnv,
} from "./security";
import {
  createGreatPmServer,
  serverIdentity,
} from "./server";

const mcpHandler = createMcpHandler(() => createGreatPmServer(), {
  legacy: "stateless",
  responseMode: "json",
  maxSubscriptions: 1,
  onerror: (error) => {
    console.error(`GreatPM MCP request error: ${error.name}`);
  },
});

const worker: ExportedHandler<GreatPmEnv> = {
  async fetch(
    request: Request,
    env: GreatPmEnv,
  ): Promise<Response> {
    const url = new URL(request.url);
    let response: Response;

    if (url.pathname === "/" && request.method === "GET") {
      response = Response.json(
        {
          name: "GreatPM MCP",
          version: serverIdentity.version,
          description:
            "Public read-only product-management methods and workflows.",
          transport: "streamable-http",
          mcp: "/mcp",
          authentication: "none",
          access: "read-only",
          repository:
            "https://github.com/VandanaAjayDubey111/great-pm",
        },
        { headers: { "cache-control": "public, max-age=3600" } },
      );
    } else if (url.pathname === "/health" && request.method === "GET") {
      response = Response.json(
        { status: "ok", service: serverIdentity.name },
        { headers: { "cache-control": "no-store" } },
      );
    } else if (url.pathname === "/mcp") {
      const rejected = guardPublicRequest(request, env);
      if (rejected) {
        response = rejected;
      } else {
        try {
          response = await mcpHandler.fetch(request);
        } catch (error) {
          console.error(
            `GreatPM MCP transport error: ${
              error instanceof Error ? error.name : "UnknownError"
            }`,
          );
          response = Response.json(
            { error: "Internal server error." },
            {
              status: 500,
              headers: { "cache-control": "no-store" },
            },
          );
        }
      }
    } else {
      response = Response.json(
        { error: "Not found." },
        {
          status: 404,
          headers: { "cache-control": "no-store" },
        },
      );
    }

    return addSecurityHeaders(response);
  },
};

function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "no-referrer");
  headers.set(
    "content-security-policy",
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  );
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default worker;
