import type { ContentDocument } from "../sanity/lib/types";

export function galleryDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

// End dates are inclusive. Dates take priority; legacy undated archives remain visible.
export function groupExhibitions(items: ContentDocument[], today = galleryDate()) {
  const ended = items.filter(item => item.endDate ? item.endDate < today : item.status === "archive")
    .sort((a, b) => (b.endDate || b.startDate || "").localeCompare(a.endDate || a.startDate || "") || (a.displayOrder ?? 100) - (b.displayOrder ?? 100) || a._id.localeCompare(b._id));
  const endedIds = new Set(ended.map(item => item._id));
  const current = items.filter(item => !endedIds.has(item._id) && (!item.startDate || item.startDate <= today) && (item.status === "current" || Boolean(item.startDate && item.endDate && item.startDate <= today && item.endDate >= today)))
    .sort((a, b) => (a.displayOrder ?? 100) - (b.displayOrder ?? 100) || (b.startDate || "").localeCompare(a.startDate || "") || a._id.localeCompare(b._id));
  return { current, past: ended[0] ?? null, archive: ended.slice(1) };
}
