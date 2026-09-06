import { readFile, mkdir, stat } from "node:fs/promises";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const photos = Object.values(JSON.parse(await readFile(new URL("lib/editorial-photos.json", root), "utf8"))).flat();
await mkdir(new URL("public/media/editorial/", root), { recursive: true });
for (const photo of photos) {
  const output = new URL(`public/media/editorial/${photo.slug}.webp`, root);
  if (await stat(output).then((file) => file.size > 10000).catch(() => false)) continue;
  // Direct URLs are recorded only after inspecting the Commons file's license page.
  let downloadUrl = photo.downloadUrl;
  if (!downloadUrl) {
    const params = new URLSearchParams({ action: "query", format: "json", prop: "imageinfo", iiprop: "url|extmetadata", titles: `File:${photo.file}` });
    const metadata = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { signal: AbortSignal.timeout(30000) });
    if (!metadata.ok) throw new Error(`Metadata: ${metadata.status}`);
    const info = Object.values((await metadata.json()).query.pages)[0].imageinfo[0];
    if (info.extmetadata.LicenseShortName.value.trim() !== photo.license) throw new Error(`License changed: ${photo.file}`);
    downloadUrl = info.url;
  }
  const response = await fetch(downloadUrl, { signal: AbortSignal.timeout(30000) });
  if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) throw new Error(`Image failed: ${photo.file}`);
  await sharp(Buffer.from(await response.arrayBuffer())).rotate().resize(960, 640, { fit: "cover" }).webp({ quality: 80 }).toFile(new URL(`public/media/editorial/${photo.slug}.webp`, root).pathname);
  console.log(`Cached ${photo.slug}`);
}
