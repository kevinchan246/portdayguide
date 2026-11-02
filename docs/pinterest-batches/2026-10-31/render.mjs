// Draft-only native photo compositions. Never writes public/, feeds or application files.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import {PINTEREST_ITEMS,pinterestDestination,escapeXml as esc} from '../../../lib/pinterest-feed.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../../..');
const batch=JSON.parse(await readFile(path.join(here,'pins.json'),'utf8'));
const credits=JSON.parse(await readFile(path.join(here,'photo-sources.json'),'utf8'));
await mkdir(path.join(here,'assets'),{recursive:true});
const cream='#FFF9EF';
const text=(x,y,value,size=36,{color=cream,font='Arial',weight=400,anchor='start',spacing=0,italic=false}={})=>`<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}" letter-spacing="${spacing}"${italic?' font-style="italic"':''}>${esc(value)}</text>`;
const svg=(body,w=1000,h=1500)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
const hash=b=>createHash('sha256').update(b).digest('hex');
async function checkedText(x,y,value,size,options={},maximum=864){
  // Reject overflow instead of silently shrinking native Georgia/Arial typography.
  const measure={...options,anchor:'start'};
  const {info}=await sharp(Buffer.from(svg(text(30,180,value,size,measure),2000,230))).trim().png().toBuffer({resolveWithObject:true});
  if(info.width>maximum)throw new Error(`Text exceeds ${maximum}px: ${value} (${info.width}px)`);
  return text(x,y,value,size,options);
}
const manifest=[],seen=new Set(PINTEREST_ITEMS.map(x=>x.id));
for(const pin of batch.pins){
  if(seen.has(pin.id))throw new Error(`Duplicate/live ID: ${pin.id}`);seen.add(pin.id);
  if(pin.title.length>100||pin.description.length>500)throw new Error(`Copy too long: ${pin.id}`);
  if(pin.publishedAt)throw new Error('Drafts must not have publication dates');
  const source=await readFile(path.join(root,pin.photoFile)),meta=await sharp(source).metadata();
  const scale=Math.max(1000/meta.width,1500/meta.height);
  if(scale>1)throw new Error(`Photo would upscale: ${pin.photoFile}`);
  const width=Math.round(1000/scale),height=Math.round(1500/scale);
  const crop={left:Math.round((meta.width-width)*pin.cropX),top:Math.round((meta.height-height)*.5),width,height};
  const photograph=await sharp(source).extract(crop).resize(1000,1500).png().toBuffer();
  const centered=['palms','sunset','night'].includes(pin.layout),x=centered?500:68,anchor=centered?'middle':'start';
  const placeSize=pin.destinationLabel==='Yokohama'?104:116;
  const topOpacity=pin.layout==='sunset'?.35:pin.layout==='aerial'?.52:pin.layout==='night'?0:.32;
  let body=`<defs><linearGradient id="top" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#071E29" stop-opacity="${topOpacity}"/><stop offset=".48" stop-color="#071E29" stop-opacity="${topOpacity}"/><stop offset="1" stop-color="#071E29" stop-opacity="0"/></linearGradient><linearGradient id="footer" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#061F28" stop-opacity="0"/><stop offset="1" stop-color="#061F28" stop-opacity=".6"/></linearGradient></defs><rect width="1000" height="500" fill="url(#top)"/><rect y="1280" width="1000" height="220" fill="url(#footer)"/>`;
  body+=await checkedText(x,240,pin.destinationLabel,placeSize,{font:'Georgia',anchor,spacing:-3,italic:pin.layout==='beach'});
  body+=await checkedText(500,1440,pin.websiteMark,26,{anchor:'middle',spacing:1.2});
  const onImageText=[pin.destinationLabel,pin.websiteMark];
  if(!['Cozumel','Mahahual','Yokohama'].includes(onImageText[0])||onImageText[1]!=='portdayguide.com'||(body.match(/<text /g)||[]).length!==2)throw new Error('Only place and website may be typeset');
  const png=await sharp(photograph).composite([{input:Buffer.from(svg(body)),left:0,top:0}]).png({compressionLevel:9}).toBuffer();
  const file=`assets/${pin.id}.png`;await writeFile(path.join(here,file),png);
  const decoded=await sharp(png).raw().toBuffer({resolveWithObject:true});
  if(decoded.info.width!==1000||decoded.info.height!==1500)throw new Error('Wrong dimensions');
  manifest.push({id:pin.id,file,bytes:png.length,sha256:hash(png),width:1000,height:1500,title:pin.title,description:pin.description,alt:pin.alt,destination:pinterestDestination(pin),board:batch.board,releaseOrder:pin.releaseOrder,publishedAt:null,actualPinUrl:null,onImageText,placeFontSize:placeSize,websiteFontSize:26,compositionLicense:'Original typography/layout by PortdayGuide; photographs retain their listed platform licenses',crop,sources:[{key:pin.photo,...credits[pin.photo],sha256:hash(source),width:meta.width,height:meta.height}]});
}
const sheet=[];
for(let i=0;i<manifest.length;i++){
  sheet.push({input:await sharp(path.join(here,manifest[i].file)).resize(300,450).png().toBuffer(),left:24+(i%3)*324,top:24+Math.floor(i/3)*474});
}
await sharp({create:{width:996,height:972,channels:3,background:'#F4F1EB'}}).composite(sheet).png().toFile(path.join(here,'contact-sheet.png'));
await writeFile(path.join(here,'manifest.json'),JSON.stringify({status:batch.status,baseCommit:batch.baseCommit,visualRevision:batch.visualRevision,pins:manifest},null,2)+'\n');
const cols=['id','title','description','alt','destination','board','releaseOrder'];
const cell=v=>`"${String(v??'').replaceAll('"','""')}"`;
await writeFile(path.join(here,'publishing-copy.csv'),'\uFEFF'+[cols.join(','),...manifest.map(p=>cols.map(k=>cell(p[k])).join(','))].join('\r\n')+'\r\n');
await import('./write-copy.mjs');
console.log(JSON.stringify({status:batch.status,pins:manifest.map(p=>({id:p.id,bytes:p.bytes,titleLength:p.title.length,descriptionLength:p.description.length})),liveFeedItems:PINTEREST_ITEMS.length},null,2));
