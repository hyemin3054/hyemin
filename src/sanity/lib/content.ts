import "server-only";
import { cache } from "react";
import { unstable_rethrow } from "next/navigation";
import { client } from "./client";
import { detailQuery, listQuery, settingsQuery, healthQuery } from "./queries";
import type { ContentDocument, ContentResult, ContentType, SiteSettings } from "./types";

async function read<T>(query: string, params: Record<string, string>, fallback: T): Promise<ContentResult<T>> {
  if (!client) return { status: "unconfigured", data: fallback };
  try {
    // No persistent cache: publishing/unpublishing is reflected on the next request.
    const data = await client.fetch<T>(query, params, { cache: "no-store", perspective: "published" });
    return { status: "ready", data };
  } catch (error) {
    unstable_rethrow(error);
    console.error("Sanity content request failed:", error instanceof Error ? error.message : "Unknown error");
    return { status: "error", data: fallback };
  }
}
export const getContentList = cache((type: ContentType) => read<ContentDocument[]>(listQuery, { type }, []));
export const getContentDetail = cache((type: ContentType, slug: string) => read<ContentDocument | null>(detailQuery, { type, slug }, null));
export const getSiteSettings = cache(() => read<SiteSettings | null>(settingsQuery, {}, null));
export const checkSanityConnection = () => read<Record<string, number> | null>(healthQuery, {}, null);
