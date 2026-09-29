import type { ArtistWork, ContentDocument, ContentImage } from "../sanity/lib/types";

export function artistArtworks(artist: ContentDocument) {
  const portfolio = (artist.portfolioImages || []).filter(image => image?.asset?._ref);
  const works = (artist.works || []).filter(Boolean);
  const main = (artist.representativeImage?.asset?._ref ? artist.representativeImage : null) || portfolio[0]
    || (artist.portrait?.asset?._ref ? artist.portrait : null) || works.find(work => work.image?.asset?._ref)?.image || null;
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
  return [
    [image?.title?.trim() || work?.title?.trim(), image?.year?.trim() || work?.year?.trim()].filter(Boolean).join(" / "),
    [image?.medium?.trim(), image?.size?.trim()].filter(Boolean).join(" / "),
  ].filter(Boolean);
}
