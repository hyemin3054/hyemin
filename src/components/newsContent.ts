import type { ContentDocument } from "@/sanity/lib/types";

export function hasNewsBody(body: ContentDocument["body"]) {
  return Boolean(body?.some(block => block._type !== "block" || block.children?.some(child =>
    child._type !== "span" || (typeof child.text === "string" && child.text.trim().length > 0)
  )));
}

export function isImageNews(item: ContentDocument) {
  return Boolean(item.mainImage?.asset?._ref) && !hasNewsBody(item.body) && !item.excerpt?.trim();
}
