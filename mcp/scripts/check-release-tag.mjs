import { readFile } from "node:fs/promises";

const releaseTag = process.argv[2];
if (!releaseTag) {
  throw new Error(
    "Usage: node scripts/check-release-tag.mjs <mcp-vX.Y.Z>",
  );
}

const [packageMetadata, serverMetadata] = await Promise.all([
  readJson(new URL("../package.json", import.meta.url)),
  readJson(new URL("../../server.json", import.meta.url)),
]);

if (packageMetadata.version !== serverMetadata.version) {
  throw new Error(
    `Version mismatch: mcp/package.json=${packageMetadata.version}, server.json=${serverMetadata.version}`,
  );
}

const expectedTag = `mcp-v${serverMetadata.version}`;
if (releaseTag !== expectedTag) {
  throw new Error(
    `Release tag mismatch: expected ${expectedTag}, received ${releaseTag}`,
  );
}

console.log(
  `Release metadata verified: ${serverMetadata.name}@${serverMetadata.version}`,
);

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}
