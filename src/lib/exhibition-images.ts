import type { ContentImage } from "../sanity/lib/types";

// Keep the primary image first, then CMS order. Repeated assets inherit any caption.
export function exhibitionImages(main?: ContentImage | null, gallery?: ContentImage[] | null) {
  const images: ContentImage[] = [];
  for (const image of [main, ...(gallery || [])]) {
    if (!image?.asset?._ref) continue;
    const existing = images.find(entry => entry.asset?._ref === image.asset!._ref);
    if (!existing) images.push({ ...image });
    else for (const field of ["title", "year", "medium", "size"] as const) {
      if (!existing[field]?.trim() && image[field]?.trim()) existing[field] = image[field];
    }
  }
  return images;
}
