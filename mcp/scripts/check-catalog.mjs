import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const temporaryDirectory = await mkdtemp(
  resolve(tmpdir(), "greatpm-catalog-"),
);
const temporaryOutput = resolve(temporaryDirectory, "catalog.ts");
const committedOutput = new URL("../src/generated/catalog.ts", import.meta.url);

try {
  await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(
      process.execPath,
      [
        new URL("./build-catalog.mjs", import.meta.url).pathname,
        `--output=${temporaryOutput}`,
      ],
      { stdio: "inherit" },
    );
    child.once("error", rejectPromise);
    child.once("exit", (code) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`Catalog generator exited with ${code}`));
    });
  });

  const [expected, actual] = await Promise.all([
    readFile(temporaryOutput, "utf8"),
    readFile(committedOutput, "utf8"),
  ]);
  if (expected !== actual) {
    throw new Error(
      "Generated catalog is stale. Run `npm run catalog:build` and commit the result.",
    );
  }
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
