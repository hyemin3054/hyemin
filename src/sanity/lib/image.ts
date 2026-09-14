import { createImageUrlBuilder } from "@sanity/image-url";
import { isSanityConfigured, sanityEnv } from "../env";
import type { ContentImage } from "./types";

export function imageUrl(image: ContentImage | null | undefined, width = 1200): string | null {
  if (!isSanityConfigured || !image?.asset?._ref) return null;
  try { return createImageUrlBuilder(sanityEnv).image(image).width(width).fit("max").auto("format").url(); }
  catch { return null; }
}
