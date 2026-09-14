import type { PortableTextBlock } from "next-sanity";

export type ContentImage = {
  _key?: string;
  asset?: { _ref: string } | null;
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; width: number; height: number };
};
export type HistoryEntry = { _key: string; year?: string | null; description?: string | null };
export type ArtistWork = { _key: string; image?: ContentImage | null; title?: string | null; year?: string | null; description?: string | null };
export type ArtistReference = { _id: string; name?: string | null; slug?: string | null };
export type ContentType = "artist" | "exhibition" | "news" | "salesArtwork";
export type ContentDocument = {
  _id: string; _type: ContentType; title: string; slug: string;
  name?: string | null; shortBio?: string | null; fullBio?: PortableTextBlock[] | null;
  portrait?: ContentImage | null; representativeImage?: ContentImage | null;
  works?: ArtistWork[] | null; selectedExhibitions?: HistoryEntry[] | null; education?: HistoryEntry[] | null; awards?: HistoryEntry[] | null;
  artist?: ArtistReference | null; startDate?: string | null; endDate?: string | null;
  mainImage?: ContentImage | null; galleryImages?: ContentImage[] | null;
  shortDescription?: string | null; description?: PortableTextBlock[] | null;
  status?: "current" | "upcoming" | "archive" | null;
  date?: string | null; excerpt?: string | null; body?: PortableTextBlock[] | null;
  year?: string | null; medium?: string | null; dimensions?: string | null; price?: number | null;
  availability?: "available" | "reserved" | "sold" | null; featured?: boolean | null; displayOrder?: number | null;
};
export type SiteSettings = {
  logo?: ContentImage | null; address?: string | null;
  openingHours?: string | null; telephone?: string | null; email?: string | null;
  instagram?: string | null; copyright?: string | null; aboutText?: PortableTextBlock[] | null;
  aboutImages?: ContentImage[] | null;
  mapInformation?: { mapUrl?: string | null; directions?: string | null; location?: { lat: number; lng: number; alt?: number } | null } | null;
};
export type ContentResult<T> = { status: "ready"; data: T } | { status: "unconfigured" | "error"; data: T };
