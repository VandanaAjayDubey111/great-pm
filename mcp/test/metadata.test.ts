import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const repositoryRoot = resolve(import.meta.dirname, "../..");
const endpoint =
  "https://greatpm-mcp.vandana424-s.workers.dev/mcp";

function read(path: string): string {
  return readFileSync(resolve(repositoryRoot, path), "utf8");
}

describe("GreatPM public release metadata", () => {
  it("publishes valid remote-only MCP Registry metadata", () => {
    const server = JSON.parse(read("server.json"));
    const packageMetadata = JSON.parse(read("mcp/package.json"));

    expect(server).toMatchObject({
      $schema:
        "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
      name: "io.github.vandanaajaydubey111/great-pm",
      title: "GreatPM",
      version: "1.0.0",
      repository: {
        url: "https://github.com/VandanaAjayDubey111/great-pm",
        source: "github",
      },
      remotes: [{ type: "streamable-http", url: endpoint }],
    });
    expect(server.description.length).toBeGreaterThan(40);
    expect(server.packages).toBeUndefined();
    expect(server.version).toBe(packageMetadata.version);
  });

  it("documents exact public installation and verification", () => {
    const readme = read("README.md");
    const guide = read("docs/MCP.md");

    expect(readme).toContain(endpoint);
    expect(readme).toContain("codex mcp add great-pm --url");
    expect(guide).toContain(endpoint);
    expect(guide).toContain('"type": "http"');
    expect(guide).toContain("greatpm_list_methods");
    expect(guide).toMatch(/Claude.*custom connector/is);
    expect(guide).toMatch(/read-only/i);
    expect(`${readme}\n${guide}`).not.toMatch(
      /<account-subdomain>|YOUR_MCP_URL|DEPLOYMENT_URL|\b(?:TODO|TBD)\b/,
    );
  });

  it("documents security, privacy, architecture, and operations", () => {
    for (const path of [
      "SECURITY.md",
      "PRIVACY.md",
      "docs/MCP-ARCHITECTURE.md",
      "docs/MCP-OPERATIONS.md",
    ]) {
      expect(read(path).length, path).toBeGreaterThan(500);
    }
  });

  it("binds Registry tags and smoke checks to the release version", () => {
    const releaseScript = resolve(
      repositoryRoot,
      "mcp/scripts/check-release-tag.mjs",
    );
    const smokeScript = read("mcp/scripts/smoke-remote.mjs");
    const publishWorkflow = read(".github/workflows/mcp-publish.yml");

    expect(() =>
      execFileSync(process.execPath, [releaseScript, "mcp-v1.0.0"], {
        cwd: resolve(repositoryRoot, "mcp"),
        stdio: "pipe",
      }),
    ).not.toThrow();
    expect(() =>
      execFileSync(process.execPath, [releaseScript, "mcp-v9.9.9"], {
        cwd: resolve(repositoryRoot, "mcp"),
        stdio: "pipe",
      }),
    ).toThrow();
    expect(smokeScript).toContain("getServerVersion");
    expect(smokeScript).toContain("expectedVersion");
    expect(publishWorkflow).toContain("release:check-tag");
  });
});
