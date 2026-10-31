// Draft-only, deterministic layout extension of scripts/generate-share-cards.mjs.
// Reuses existing licensed pixels. Does not write public/, feeds or application files.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";
import { PINTEREST_ITEMS, pinterestDestination, escapeXml as esc } from "../../../lib/pinterest-feed.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const batch = JSON.parse(await readFile(path.join(here, "pins.json"), "utf8"));
const credits = {
  ...JSON.parse(await readFile(path.join(root, "lib/scenic-photo-credits.json"), "utf8")),
  ...JSON.parse(await readFile(path.join(root, "lib/article-photo-credits.json"), "utf8")),
};
const out = path.join(here, "assets");
await mkdir(out, { recursive: true });
const ink = "#103A45", cream = "#FFF9EF", teal = "#006B67", gold = "#FFD18C";
const text = (x, y, value, size = 36, color = ink, weight = 400, extra = "") =>
  `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" ${extra}>${esc(value)}</text>`;
const rect = (x,y,w,h,color) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/>`;
const svg = (body,w=1000,h=1500) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
const overlays = (body) => ({ input: Buffer.from(svg(body)), left: 0, top: 0 });

async function fitText(value, initial, maximum = 884) {
  let size = initial;
  while (size > 20) {
    // Inspect the output width after trim, rather than input metadata.
    const { info } = await sharp(Buffer.from(svg(text(0,130,value,size,ink,700),1600,180))).trim().png().toBuffer({resolveWithObject:true});
    if (info.width <= maximum) return size;
    size -= 2;
  }
  throw new Error(`Text does not fit: ${value}`);
}

const manifest = [];
const seen = new Set(PINTEREST_ITEMS.map(x => x.id));
for (const pin of batch.pins) {
  if (seen.has(pin.id)) throw new Error(`Duplicate/live ID: ${pin.id}`);
  seen.add(pin.id);
  if (pin.title.length > 100 || pin.description.length > 500) throw new Error(`Copy too long: ${pin.id}`);
  if (pin.publishedAt) throw new Error("Drafts must not have publication dates");
  const layout = [];
  const sourceEvidence = [];
  async function photo(key, file, y, height, position="centre") {
    const buffer = await readFile(path.join(root,file));
    const meta = await sharp(buffer).metadata();
    const scale = Math.max(1000/meta.width, height/meta.height);
    if (scale > 1) throw new Error(`Photo would upscale: ${file}`);
    const image = await sharp(buffer).resize(1000,height,{fit:"cover",position}).png().toBuffer();
    layout.push({input:image,left:0,top:y});
    sourceEvidence.push({key,localPath:file,sha256:createHash("sha256").update(buffer).digest("hex"),width:meta.width,height:meta.height,...credits[key],batchSourceChecked:"2026-10-31"});
  }
  let body = "";
  if (pin.layout === "photo-top") {
    await photo(pin.photo,pin.photoFile,0,690,pin.cropPosition);
    body += rect(0,642,1000,48,ink);
    body += text(42,675,pin.photoCaption,23,"#FFFFFF");
    body += text(960,675,pin.credit,23,"#FFFFFF",400,'text-anchor="end"');
    body += rect(58,744,9,25,teal)+text(85,766,pin.eyebrow,25,teal,700);
    for (let i=0;i<pin.headline.length;i++) body += text(58,868+i*101,pin.headline[i],await fitText(pin.headline[i],92),ink,700,'letter-spacing="-2"');
    pin.support.forEach((s,i)=>body+=text(62,1150+i*47,s,36,ink));
  } else if (pin.layout === "title-top") {
    body += rect(0,0,1000,420,ink);
    body += rect(58,61,9,25,gold)+text(85,83,pin.eyebrow,25,gold,700);
    for (let i=0;i<pin.headline.length;i++) body += text(58,208+i*110,pin.headline[i],await fitText(pin.headline[i],94),cream,700,'letter-spacing="-2"');
    await photo(pin.photo,pin.photoFile,420,620,pin.cropPosition);
    body += rect(0,992,1000,48,ink);
    body += text(42,1025,pin.photoCaption,23,"#FFFFFF");
    body += text(960,1025,pin.credit,23,"#FFFFFF",400,'text-anchor="end"');
    pin.support.forEach((s,i)=>body+=text(60,1120+i*54,s,40,ink,i===0?700:400));
  } else if (pin.layout === "comparison") {
    body += rect(0,0,1000,400,ink);
    body += rect(58,61,9,25,gold)+text(85,83,pin.eyebrow,25,gold,700);
    for (let i=0;i<pin.headline.length;i++) body += text(58,205+i*108,pin.headline[i],await fitText(pin.headline[i],96),cream,700,'letter-spacing="-2"');
    await photo(pin.photo,pin.photoFile,400,330,"south");
    await photo(pin.secondPhoto,pin.secondPhotoFile,810,330,"centre");
    body += rect(0,689,1000,41,ink)+text(35,718,"Port entrance / 2023",22,"#FFFFFF")+text(965,718,"Larry D. Moore",22,"#FFFFFF",400,'text-anchor="end"');
    body += rect(0,730,1000,80,"#E1ECE5")+text(58,783,pin.support[0],39,ink,700);
    body += rect(0,1099,1000,41,ink)+text(35,1128,"Mahahual malecon / 2008",22,"#FFFFFF")+text(965,1128,"Juan Ortega",22,"#FFFFFF",400,'text-anchor="end"');
    body += rect(0,1140,1000,80,"#E1ECE5")+text(58,1193,pin.support[1],39,ink,700);
  } else throw new Error(`Unknown layout: ${pin.layout}`);

  body += `<rect x="58" y="1265" width="884" height="104" rx="6" fill="${teal}"/>`;
  body += text(94,1332,pin.cta,await fitText(pin.cta,40,740),"#FFFFFF",700);
  body += `<path d="M864 1316 H902 M888 1302 L902 1316 L888 1330" stroke="#FFFFFF" stroke-width="4" fill="none"/>`;
  body += rect(58,1414,884,1,"#D2DAD2")+text(58,1462,"PortdayGuide",32,ink,700)+text(942,1460,"portdayguide.com",27,ink,400,'text-anchor="end"');

  const file = `${pin.id}.png`;
  const png = await sharp({create:{width:1000,height:1500,channels:3,background:cream}}).composite([...layout,overlays(body)]).png({compressionLevel:9}).toBuffer();
  await writeFile(path.join(out,file),png);
  // A full decode catches truncated/corrupt pixels, not merely a valid PNG header.
  const decoded = await sharp(png).raw().toBuffer({resolveWithObject:true});
  if (decoded.info.width!==1000 || decoded.info.height!==1500) throw new Error("Wrong dimensions");
  manifest.push({id:pin.id,file:`assets/${file}`,bytes:png.length,sha256:createHash("sha256").update(png).digest("hex"),width:1000,height:1500,title:pin.title,description:pin.description,alt:pin.alt,destination:pinterestDestination(pin),board:batch.board,releaseOrder:pin.releaseOrder,publishedAt:null,actualPinUrl:null,compositionLicense:pin.compositionLicense||"Original typography/layout by PortdayGuide; photographs retain their listed licenses",sources:sourceEvidence});
}

// 300 px per Pin is a realistic small preview. The original six images remain full size.
const sheet=[];
let sheetLabel=text(24,45,"PortdayGuide / Six draft Pins",28,ink,700)+text(24,78,"Review only — not scheduled or published",18,ink);
for (let i=0;i<manifest.length;i++) {
  const x=24+(i%3)*324,y=110+Math.floor(i/3)*498;
  sheet.push({input:await sharp(path.join(here,manifest[i].file)).resize(300,450).png().toBuffer(),left:x,top:y});
  sheetLabel+=text(x,y+477,`${String(i+1).padStart(2,"0")} / ${batch.pins[i].id.split("-")[0]}`,18,ink,700);
}
sheet.push({input:Buffer.from(svg(sheetLabel,996,1118)),left:0,top:0});
await sharp({create:{width:996,height:1118,channels:3,background:"#EAEFEA"}}).composite(sheet).png().toFile(path.join(here,"contact-sheet.png"));
await writeFile(path.join(here,"manifest.json"),JSON.stringify({status:batch.status,baseCommit:batch.baseCommit,pins:manifest},null,2)+"\n");
const cols=["id","title","description","alt","destination","board","releaseOrder"];
const cell = v => `"${String(v??"").replaceAll('"','""')}"`;
await writeFile(path.join(here,"publishing-copy.csv"),"\uFEFF"+[cols.join(","),...manifest.map(p=>cols.map(k=>cell(p[k])).join(","))].join("\r\n")+"\r\n");
console.log(JSON.stringify({status:batch.status,pins:manifest.map(p=>({id:p.id,bytes:p.bytes,titleLength:p.title.length,descriptionLength:p.description.length})),contactSheet:"contact-sheet.png",liveFeedItems:PINTEREST_ITEMS.length},null,2));
