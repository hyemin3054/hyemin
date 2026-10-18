import { isDeepStrictEqual } from 'node:util';
import { getCliClient } from 'sanity/cli';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const client=getCliClient({apiVersion:'2026-10-19'}).withConfig({perspective:'raw',useCdn:false});
const dryRun=process.argv.includes('--dry-run');
const docs=await client.fetch('*[(_type=="siteSettings" && _id in ["siteSettings","drafts.siteSettings"]) || (_type=="artist" && !(_id in path("versions.**")))]');
const changes=[];
for(const doc of docs){
 const fields={};
 if(doc._type==='siteSettings' && !Array.isArray(doc.aboutSections)){
  const body=(doc.aboutText||[]).map(block=>({...block,children:block.children?.map(child=>({...child,text:child.text?.replace('도시 속에서 만나는 작은 동굴','').replace('그 안의 세계를 들여다보다.','').replace('그 안의 세계를 들여다보다','')}))})).filter(block=>{const text=(block.children||[]).map(c=>c.text||'').join('').trim();return text && text!=='Grotto Art Window';});
  fields.aboutSections=[{_key:'gallery',_type:'aboutSection',title:'작은 윈도우 갤러리, 작은 동굴',body:body.slice(0,3),...(doc.aboutImages?.[0]?{image:doc.aboutImages[0]}:{})},{_key:'showcase',_type:'aboutSection',title:'예술을 경험하는 비영리 쇼케이스 공간',body:body.slice(3),...(doc.aboutImages?.[1]?{image:doc.aboutImages[1]}:{})}];
 }
 if(doc._type==='artist'){
  const works=[...(doc.works||[])];const seen=new Set(works.map(w=>w.image?.asset?._ref).filter(Boolean));
  for(const image of doc.portfolioImages||[]){if(image.asset?._ref && !seen.has(image.asset._ref)){seen.add(image.asset._ref);works.push({_key:'portfolio-'+(image._key||works.length),_type:'artistWork',image,...(image.title?{title:image.title}:{}),...(image.year?{year:image.year}:{}),...(image.size?{dimensions:image.size}:{}),...(image.medium?{medium:image.medium}:{})});}}
  if(works.length!==(doc.works||[]).length) fields.works=works;
 }
 if(Object.keys(fields).length)changes.push({doc,fields});
}
console.log(JSON.stringify({dryRun,changes:changes.map(({doc,fields})=>({id:doc._id,fields:Object.keys(fields)}))}));
if(!dryRun && changes.length){
 const backup=join(tmpdir(),`grotto-about-artist-${Date.now()}.json`);writeFileSync(backup,JSON.stringify(docs,null,2));console.log('Backup: '+backup);
 let tx=client.transaction();for(const {doc,fields}of changes)tx=tx.patch(doc._id,p=>p.ifRevisionId(doc._rev).set(fields));await tx.commit();
 const after=await client.fetch('*[_id in $ids]',{ids:changes.map(x=>x.doc._id)});
 for(const {doc,fields}of changes){const saved=after.find(x=>x._id===doc._id);for(const [key,value]of Object.entries(fields))if(!isDeepStrictEqual(saved[key], JSON.parse(JSON.stringify(value))))throw Error('Verification failed: '+doc._id+'/'+key);for(const key of ['aboutText','aboutImages','portfolioImages'])if(!isDeepStrictEqual(saved[key],doc[key]))throw Error('Legacy data changed');}
 console.log('Verified additive migration; legacy data unchanged.');
}
