import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = new URL("../", import.meta.url);
const source = await readFile(new URL("lib/port-photos.ts", root), "utf8");
const photos = [...source.matchAll(/^\s*"([a-z0-9-]+)": \{ file: "([^"]+)"/gm)].map((match) => ({
  slug: match[1],
  file: match[2],
}));

if (photos.length !== 64) throw new Error(`Expected 64 port photos, found ${photos.length}`);

const outputDir = new URL("public/media/ports/", root);
await mkdir(outputDir, { recursive: true });
const tempDir = await mkdtemp(join(tmpdir(), "portday-photos-"));
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const normalizeFile = (file) => file.replaceAll("_", " ").trim().toLocaleLowerCase();
const thumbUrls = new Map();
for (let index = 0; index < photos.length; index += 40) {
  const batch = photos.slice(index, index + 40);
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "1600",
    redirects: "1",
    titles: batch.map(({ file }) => `File:${file}`).join("|"),
  });
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { "User-Agent": "PortdayGuide/1.0 (https://portdayguide.com/about)" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`Unable to resolve Wikimedia thumbnails: ${response.status}`);
  const data = await response.json();
  for (const page of data.query?.pages || []) {
    const file = page.title?.replace(/^File:/, "");
    const sourceUrl = page.imageinfo?.[0]?.url || page.imageinfo?.[0]?.thumburl;
    if (file && sourceUrl) thumbUrls.set(normalizeFile(file), sourceUrl);
  }
}

async function cachePhoto({ slug, file }) {
  const output = new URL(`${slug}.jpg`, outputDir);
  try {
    if ((await stat(output)).size > 10_000) return;
  } catch {}

  const url = thumbUrls.get(normalizeFile(file));
  if (!url) throw new Error(`${slug}: Wikimedia thumbnail URL could not be resolved`);
  let response;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    response = await fetch(url, {
      headers: { "User-Agent": "PortdayGuide/1.0 (https://portdayguide.com/about)" },
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
    });
    if (response.ok && response.headers.get("content-type")?.startsWith("image/")) break;
    if (response.status !== 429 || attempt === 6) {
      throw new Error(`${slug}: Wikimedia returned ${response.status} ${response.headers.get("content-type") || "unknown type"}`);
    }
    await response.arrayBuffer();
    await delay(attempt * 2_000);
  }

  const input = join(tempDir, `${slug}.source`);
  await writeFile(input, new Uint8Array(await response.arrayBuffer()));
  await run("convert", [input, "-auto-orient", "-resize", "1600x1100>", "-strip", "-quality", "82", new URL(`${slug}.jpg`, outputDir).pathname]);
}

let cursor = 0;
const failures = [];
async function worker() {
  while (cursor < photos.length) {
    const photo = photos[cursor++];
    try {
      await cachePhoto(photo);
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }
}

await Promise.all(Array.from({ length: 2 }, worker));
await rm(tempDir, { recursive: true, force: true });
if (failures.length) throw new Error(`Failed to cache ${failures.length} photos:\n${failures.join("\n")}`);
console.log(`Cached ${photos.length} same-origin port photos.`);
