import type { ArtistWork, ContentDocument, ContentImage } from "../sanity/lib/types";

export function artistArtworks(artist: ContentDocument) {
  // Merge caption fields for the same asset without changing stored CMS data.
  const captionImages = [artist.representativeImage, ...(artist.portfolioImages || []), ...(artist.works || []).map(work => work.image), artist.portrait];
  const enrich = (image?: ContentImage | null) => {
    if (!image?.asset?._ref) return image;
    const merged = { ...image };
    for (const match of captionImages.filter(candidate => candidate?.asset?._ref === image.asset!._ref)) {
      for (const field of ["title", "year", "size", "medium"] as const) {
        if (!merged[field]?.trim() && match?.[field]?.trim()) merged[field] = match[field];
      }
    }
    return merged;
  };
  const portfolio = (artist.portfolioImages || []).filter(image => image?.asset?._ref).map(image => enrich(image)!);
  const works = (artist.works || []).filter(Boolean).map(work => ({ ...work, image: enrich(work.image) }));
  const main = enrich((artist.representativeImage?.asset?._ref ? artist.representativeImage : null) || portfolio[0]
    || (artist.portrait?.asset?._ref ? artist.portrait : null) || works.find(work => work.image?.asset?._ref)?.image || null);
  const mainWork = works.find(work => main?.asset?._ref && work.image?.asset?._ref === main.asset._ref);
  const additional: ArtistWork[] = [];
  const seen = new Set(main?.asset?._ref ? [main.asset._ref] : []);
  const candidates: ArtistWork[] = [...works, ...portfolio.map(image => ({ _key: image._key || image.asset!._ref, image })), ...(artist.representativeImage?.asset?._ref ? [{ _key: "legacy-representative", image: artist.representativeImage }] : [])];
  for (const work of candidates) {
    const ref = work.image?.asset?._ref;
    if (ref && seen.has(ref)) continue;
    if (ref) seen.add(ref);
    if (ref || work.title?.trim() || work.year?.trim() || work.description?.trim()) additional.push(work);
  }
  return { main, mainWork, additional };
}

export function artworkCaption(image?: ContentImage | null, work?: ArtistWork) {
  const title = work?.title?.trim() || image?.title?.trim();
  const year = work?.year?.trim() || image?.year?.trim();
  const dimensions = work?.dimensions?.trim() || image?.size?.trim();
  const medium = work?.medium?.trim() || image?.medium?.trim();
  return [[title, year].filter(Boolean).join(", "), [dimensions, medium].filter(Boolean).join(", ")].filter(Boolean);
}
