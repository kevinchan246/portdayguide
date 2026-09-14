#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { HEALTH_TARGETS, PRODUCTION_ORIGIN, inspectTarget, parseBaseUrl } from "../lib/site-health.mjs";

const TIMEOUT_MS = 10_000;
const BODY_LIMIT = 2 * 1024 * 1024;

function options(args) {
  let baseUrl = PRODUCTION_ORIGIN;
  let output;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--help") return { help: true };
    if (!["--base-url", "--output"].includes(arg) || !args[index + 1] || args[index + 1].startsWith("--")) throw new Error("Usage: node scripts/check-live-site.mjs [--base-url HTTPS_OR_LOCALHOST_ORIGIN] [--output outputs/site-health.json]");
    if (arg === "--base-url") baseUrl = args[++index];
    else output = args[++index];
  }
  const normalized = parseBaseUrl(baseUrl);
  if (output) {
    output = path.resolve(output);
    const relative = path.relative(path.resolve("outputs"), output);
    if (!relative || relative.startsWith(`..${path.sep}`) || relative === ".." || path.isAbsolute(relative) || !output.endsWith(".json")) throw new Error("--output must be a .json file inside the ignored outputs/ directory");
  }
  return { baseUrl: normalized, output, preview: normalized !== PRODUCTION_ORIGIN };
}

async function boundedText(response) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks = [];
  let bytes = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > BODY_LIMIT) {
        await reader.cancel();
        const error = new Error("Response exceeds the 2 MiB inspection limit");
        error.code = "RESPONSE_TOO_LARGE";
        throw error;
      }
      chunks.push(Buffer.from(value));
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks).toString("utf8");
}

async function inspect(target, config) {
  const url = new URL(target.path, config.baseUrl).href;
  const started = Date.now();
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      // Never follow redirects, send credentials, POST, or navigate affiliate links.
      const response = await fetch(url, {
        method: "GET", credentials: "omit", redirect: "manual",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { Accept: target.kind === "products" ? "application/json" : target.kind === "page" ? "text/html" : "*/*" },
      });
      if (attempt === 1 && [429, 502, 503, 504].includes(response.status)) {
        await response.body?.cancel();
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      const body = response.status === 200 ? await boundedText(response) : "";
      if (response.status !== 200) await response.body?.cancel();
      const checked = inspectTarget(target, { status: response.status, body, contentType: response.headers.get("content-type") || "", robotsHeader: response.headers.get("x-robots-tag") || "" }, config);
      return { path: target.path, httpStatus: response.status, attempts: attempt, durationMs: Date.now() - started, ...checked };
    } catch (error) {
      const tooLarge = error?.code === "RESPONSE_TOO_LARGE";
      if (attempt === 1 && !tooLarge) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      const category = tooLarge ? "inspection_limit" : "network_error";
      const message = tooLarge ? "Response exceeds the 2 MiB inspection limit" : "Request failed or timed out; site outage has not been established";
      return { path: target.path, httpStatus: null, attempts: attempt, durationMs: Date.now() - started, state: "failure", category, issues: [{ code: category, severity: "failure", message }] };
    }
  }
}

async function main() {
  const config = options(process.argv.slice(2));
  if (config.help) {
    console.log("Usage: node scripts/check-live-site.mjs [--base-url HTTPS_OR_LOCALHOST_ORIGIN] [--output outputs/site-health.json]\nRead-only GET checks; at most 3 concurrent requests and one retry. Production canonicals remain required on previews; preview noindex is accepted. Failures and incomplete checks exit 1; empty inventory warns and exits 0.");
    return;
  }
  const checkedAt = new Date().toISOString();
  const checks = new Array(HEALTH_TARGETS.length);
  let next = 0;
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (next < HEALTH_TARGETS.length) {
      const index = next++;
      checks[index] = await inspect(HEALTH_TARGETS[index], config);
    }
  }));
  const summary = { pass: 0, warning: 0, failure: 0 };
  for (const check of checks) summary[check.state]++;
  const report = { schemaVersion: 1, checkedAt, baseUrl: config.baseUrl, mode: config.preview ? "preview" : "production", state: summary.failure ? "failure" : summary.warning ? "warning" : "pass", summary, checks };
  const json = `${JSON.stringify(report, null, 2)}\n`;
  if (config.output) {
    await mkdir(path.dirname(config.output), { recursive: true });
    await writeFile(config.output, json, "utf8");
  }
  process.stdout.write(json);
  if (summary.failure) process.exitCode = 1;
}

try { await main(); }
catch {
  // Do not echo raw input, response bodies, headers, error causes or credentials.
  process.stdout.write(`${JSON.stringify({ schemaVersion: 1, state: "failure", category: "configuration_or_output_error", message: "Invalid arguments or unable to write output. Use --help; output must be a .json file under outputs/." })}\n`);
  process.exitCode = 1;
}
