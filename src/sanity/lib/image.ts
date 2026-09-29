import { createImageUrlBuilder } from "@sanity/image-url";
import { isSanityConfigured, sanityEnv } from "../env";
import type { ContentImage } from "./types";

export function imageUrl(image: ContentImage | null | undefined, width = 1200): string | null {
  if (!isSanityConfigured || !image?.asset?._ref) return null;
  try { return createImageUrlBuilder(sanityEnv).image(image).width(width).fit("max").auto("format").url(); }
  catch { return null; }
}

// Fixed preview frames let Sanity respect the saved crop and hotspot.
export function previewImageUrl(image: ContentImage | null | undefined, width: number, height: number): string | null {
  if (!isSanityConfigured || !image?.asset?._ref) return null;
  try { return createImageUrlBuilder(sanityEnv).image(image).width(width).height(height).fit("crop").auto("format").url(); }
  catch { return null; }
}
