import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import sharp from "sharp";

// Run after caching or replacing an original photograph. Existing public URLs
// remain available for social previews, structured data and older links.
const root = new URL("../", import.meta.url);
const editorial = Object.values(JSON.parse(await readFile(new URL("lib/editorial-photos.json", root), "utf8"))).flat();
const inputs = [
  ...(await readdir(new URL("public/media/ports/", root))).filter((file) => file.endsWith(".jpg")).map((file) => `/media/ports/${file}`),
  ...editorial.map((photo) => `/media/editorial/${photo.slug}.webp`),
  ...(await readdir(new URL("public/media/blog/", root))).filter((file) => file.endsWith(".jpg") || file === "port-canaveral-sunset.webp").map((file) => `/media/blog/${file}`),
];

const manifest = {};
for (const src of inputs.sort()) {
  const input = new URL(`public${src}`, root);
  const originalStat = await stat(input);
  const metadata = await sharp(input.pathname).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Missing image dimensions: ${src}`);
  const widths = [...new Set([480, 800, Math.min(metadata.width, 1600)].filter((width) => width <= metadata.width))].sort((a, b) => a - b);
  const variants = [];
  for (const width of widths) {
    const path = src.replace(/\.(?:jpg|webp)$/, `-${width}.webp`);
    const output = new URL(`public${path}`, root);
    await mkdir(new URL("./", output), { recursive: true });
    const cached = await stat(output).catch(() => undefined);
    if (cached && cached.mtimeMs >= originalStat.mtimeMs) {
      const result = await sharp(output.pathname).metadata();
      variants.push({ src: path, width: result.width, height: result.height, bytes: cached.size });
    } else {
      const result = await sharp(input.pathname).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(output.pathname);
      variants.push({ src: path, width: result.width, height: result.height, bytes: result.size });
    }
  }
  manifest[src] = { width: metadata.width, height: metadata.height, bytes: originalStat.size, variants };
}
await writeFile(new URL("lib/local-photo-variants.json", root), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Created responsive variants for ${Object.keys(manifest).length} local images.`);
