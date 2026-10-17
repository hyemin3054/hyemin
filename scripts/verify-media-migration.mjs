import { getCliClient } from 'sanity/cli';
import { readFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
const client = getCliClient({apiVersion:'2026-10-17'}).withConfig({perspective:'raw',useCdn:false});
const before = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const after = await client.fetch('*[_type == "exhibition"]');
for (const old of before) {
  const current = after.find(doc => doc._id === old._id);
  if (!isDeepStrictEqual(old.galleryImages ?? null, current?.galleryImages ?? null)) throw new Error(`Legacy changed: ${old._id}`);
  for (const field of ['installationImages', 'artworkImages']) {
    const original = old[field]?.length ? old[field] : old.galleryImages?.length ? old.galleryImages : before.find(doc => doc._id === old._id.replace(/^drafts\./,''))?.galleryImages;
    if (!isDeepStrictEqual(current[field], original)) throw new Error(`Mismatch: ${old._id}/${field}`);
  }
}
console.log(`Verified all references, order, captions, and legacy arrays in ${after.length} documents.`);
console.log(JSON.stringify(await client.fetch('*[_type == "siteSettings"]{_id,"aboutCount":count(aboutImages),"feature":defined(aboutFeatureImage.asset)}')));
