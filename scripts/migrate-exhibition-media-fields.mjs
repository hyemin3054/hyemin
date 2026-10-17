import { getCliClient } from "sanity/cli";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const client = getCliClient({ apiVersion: "2026-10-17" }).withConfig({ perspective: "raw", useCdn: false });
const dryRun = process.argv.includes("--dry-run");
const exhibitions = await client.fetch(`*[_type == "exhibition"]{
  _id,
  _rev,
  title,
  galleryImages,
  installationImages,
  artworkImages
}`);

const publishedById = new Map(exhibitions
  .filter(document => !document._id.startsWith("drafts."))
  .map(document => [document._id, document]));

const migrations = exhibitions.flatMap((document) => {
  const ownLegacyImages = Array.isArray(document.galleryImages) ? document.galleryImages : [];
  const published = publishedById.get(document._id.replace(/^drafts\./, ""));
  const publishedLegacyImages = Array.isArray(published?.galleryImages) ? published.galleryImages : [];
  const legacyImages = ownLegacyImages.length ? ownLegacyImages : publishedLegacyImages;
  if (!legacyImages.length) return [];

  const fields = {};
  if (!Array.isArray(document.installationImages) || document.installationImages.length === 0) {
    fields.installationImages = legacyImages;
  }
  if (!Array.isArray(document.artworkImages) || document.artworkImages.length === 0) {
    fields.artworkImages = legacyImages;
  }
  return Object.keys(fields).length ? [{ document, fields }] : [];
});

console.log(JSON.stringify({
  dryRun,
  documents: migrations.map(({ document, fields }) => ({
    id: document._id,
    title: document.title,
    copiedImages: (fields.installationImages || fields.artworkImages).length,
    targetFields: Object.keys(fields),
  })),
}, null, 2));

if (!dryRun && migrations.length) {
  const backupPath = join(tmpdir(), `grotto-exhibition-media-${Date.now()}.json`);
  writeFileSync(backupPath, JSON.stringify(exhibitions, null, 2));
  console.log(`Pre-migration backup: ${backupPath}`);
  let transaction = client.transaction();
  for (const { document, fields } of migrations) {
    transaction = transaction.patch(document._id, patch => patch.ifRevisionId(document._rev).set(fields));
  }
  await transaction.commit({ autoGenerateArrayKeys: false });
  const after = await client.fetch('*[_id in $ids]', { ids: migrations.map(({ document }) => document._id) });
  for (const { document, fields } of migrations) {
    const saved = after.find(entry => entry._id === document._id);
    for (const [field, value] of Object.entries(fields)) {
      if (JSON.stringify(saved?.[field]) !== JSON.stringify(value)) throw new Error(`Verification failed: ${document._id}/${field}`);
    }
    if (JSON.stringify(saved?.galleryImages ?? null) !== JSON.stringify(document.galleryImages ?? null)) throw new Error(`Legacy data changed: ${document._id}`);
  }
  console.log(`Migrated ${migrations.length} exhibition documents without changing galleryImages.`);
}
