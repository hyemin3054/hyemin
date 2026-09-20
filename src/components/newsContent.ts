import type { ContentDocument } from "@/sanity/lib/types";

export function hasNewsBody(body: ContentDocument["body"]) {
  return Boolean(body?.some(block => block._type !== "block" || block.children?.some(child =>
    child._type !== "span" || (typeof child.text === "string" && child.text.trim().length > 0)
  )));
}

export function isImageNews(item: ContentDocument) {
  if (!item.mainImage?.asset?._ref) return false;
  if (!hasNewsBody(item.body)) return true;
  // A repeated headline and date range is a caption, not an article.
  // Keep every other sentence or rich-content block in the regular layout.
  if (item.body?.some(block => block._type !== "block" || block.children?.some(child => child._type !== "span"))) return false;
  const normalize = (text: string) => text.normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, "");
  const title = normalize(item.title);
  let remainder = normalize((item.body || []).map(block => (block.children || []).map(child => typeof child.text === "string" ? child.text : "").join(" ")).join(" "));
  if (title) remainder = remainder.split(title).join("");
  remainder = remainder.replace(/(?:19|20)\d{2}[./-]\d{1,2}[./-]\d{1,2}|\d{1,2}[./-]\d{1,2}/g, "");
  return /^[\s.,/–—~\-()[\]:]*$/.test(remainder);
}
