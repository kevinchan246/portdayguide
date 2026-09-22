// Deterministic, text-only information cards. No generated travel photography.
// Uses sharp, provided by Next.js, or the configured Codex runtime during editing.
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { escapeXml } from "../lib/pinterest-feed.mjs";

const require = createRequire(import.meta.url);
let sharp;
try { sharp = require("sharp"); }
catch {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw new Error("Install dependencies before generating share cards.");
  sharp = require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, "sharp"));
}

const outputDirectory = fileURLToPath(new URL("../public/media/share/", import.meta.url));
const text = (x, y, value, size, fill = "#102a43", weight = 400) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}">${escapeXml(value)}</text>`;

function card({ eyebrow, title, subtitle, steps, cta, file }) {
  const contents = steps.map((step, i) => {
    const top = 490 + i * 208;
    return `<rect x="64" y="${top}" width="872" height="188" rx="24" fill="#ffffff" stroke="#d7e5e8" stroke-width="2"/>
      <circle cx="114" cy="${top + 52}" r="25" fill="#e6f7f4"/>
      ${text(105, top + 63, String(i + 1), 29, "#087c74", 700)}
      ${text(163, top + 65, step.heading, 34, "#082d4c", 700)}
      ${step.lines.map((line, index) => text(163, top + 114 + index * 40, line, 28, "#37546f")).join("")}`;
  }).join("");
  return {
    file,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1500" viewBox="0 0 1000 1500">
      <rect width="1000" height="1500" fill="#fffdf8"/>
      <rect width="1000" height="425" fill="#082d4c"/>
      <path d="M0 415 Q250 455 500 423 T1000 425 V450 H0Z" fill="#d9f5e8"/>
      <g font-family="DejaVu Sans, Arial, sans-serif">
        <rect x="64" y="58" width="11" height="31" rx="5" fill="#48d5be"/>
        ${text(93, 83, eyebrow, 23, "#bdeee5", 700)}
        ${title.map((line, index) => text(64, 182 + index * 84, line, 70, "#ffffff", 700)).join("")}
        ${text(68, 371, subtitle, 28, "#cce2ea")}
        ${contents}
        <rect x="64" y="1152" width="872" height="150" rx="24" fill="#e6f7f4"/>
        ${text(98, 1212, cta[0], 34, "#087c74", 700)}
        ${text(98, 1261, cta[1], 27, "#37546f")}
        <path d="M64 1368 H936" stroke="#d7e5e8" stroke-width="2"/>
        ${text(64, 1424, "PortdayGuide.", 34, "#2257d7", 700)}
        ${text(619, 1423, "portdayguide.com", 28, "#37546f")}
      </g>
    </svg>`,
  };
}

const cards = [
  card({
    file: "tokyo-yokohama-transfer-checklist.png",
    eyebrow: "CRUISE DEPARTURE CHECKLIST",
    title: ["Tokyo hotel", "to Yokohama"],
    subtitle: "Three checks before booking your ride.",
    steps: [
      { heading: "Name the exact terminal", lines: ["Osanbashi, Shinko or Daikoku?", "Use the terminal on your cruise documents."] },
      { heading: "Count people and bags", lines: ["Check seats AND luggage capacity.", "Confirm child seats or mobility needs."] },
      { heading: "Confirm arrival and pickup", lines: ["Use your cruise check-in instructions.", "Confirm hotel pickup and driver contact."] },
    ],
    cta: ["Open the free departure checklist", "Then compare train, taxi and private transfer."],
  }),
  card({
    file: "cozumel-whole-party-taxi-budget.png",
    eyebrow: "CRUISE PORT TRANSPORT BUDGET",
    title: ["Cozumel taxis:", "the group total"],
    subtitle: "Compare the whole day, not a one-way fare.",
    steps: [
      { heading: "Add both rides", lines: ["Get outward AND return quotes.", "Include every vehicle your party needs."] },
      { heading: "Include the extras", lines: ["Check admission and waiting charges.", "Use one currency for every amount."] },
      { heading: "Compare like for like", lines: ["Same people, route and included time.", "Check pickup and return arrangements."] },
    ],
    cta: ["Try the free group-cost calculator", "Enter your own quotes; no live fare lookup."],
  }),
];

await mkdir(outputDirectory, { recursive: true });
for (const item of cards) {
  const png = await sharp(Buffer.from(item.svg)).png().toBuffer();
  await writeFile(path.join(outputDirectory, item.file), png);
  process.stdout.write(`${item.file}: ${png.length} bytes\n`);
}
