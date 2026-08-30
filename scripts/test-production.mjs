import { spawn } from "node:child_process";
import process from "node:process";

const host = "127.0.0.1";
const port = process.env.TEST_PORT ?? "4173";
const baseUrl = `http://${host}:${port}`;
const nextBin = new URL("../node_modules/next/dist/bin/next", import.meta.url);
const logs = [];

const server = spawn(process.execPath, [nextBin.pathname, "start", "-H", host, "-p", port], {
  cwd: new URL("../", import.meta.url),
  env: { ...process.env, VIATOR_API_KEY: "" },
  stdio: ["ignore", "pipe", "pipe"],
});

for (const stream of [server.stdout, server.stderr]) {
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    logs.push(chunk);
    if (logs.length > 80) logs.shift();
  });
}

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Next.js exited before becoming ready.\n${logs.join("")}`);
    try {
      const response = await fetch(baseUrl, { signal: AbortSignal.timeout(2_000) });
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for Next.js.\n${logs.join("")}`);
}

function stopServer() {
  if (server.exitCode === null) server.kill("SIGTERM");
}

try {
  await waitForServer();
  const tests = spawn(process.execPath, ["--experimental-strip-types", "--test", "tests/rendered-html.test.mjs"], {
    cwd: new URL("../", import.meta.url),
    env: { ...process.env, TEST_BASE_URL: baseUrl, VIATOR_API_KEY: "" },
    stdio: "inherit",
  });
  const exitCode = await new Promise((resolve, reject) => {
    tests.once("error", reject);
    tests.once("exit", (code, signal) => resolve(code ?? (signal ? 1 : 0)));
  });
  if (exitCode !== 0) process.exitCode = exitCode;
} finally {
  stopServer();
}
