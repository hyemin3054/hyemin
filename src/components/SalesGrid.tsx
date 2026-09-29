import Link from "next/link";
import type { ContentDocument } from "@/sanity/lib/types";
import { imageUrl } from "@/sanity/lib/image";
import { ContentVisual } from "./ContentVisual";
import { SalesStatus } from "./SalesStatus";
export const artworkPrice = (price?: number | null) => price == null ? "가격 문의" : `₩ ${price.toLocaleString("ko-KR")}`;
export function sortArtworks(items: ContentDocument[]) {
  return [...items].sort((a, b) => {
    if (a.displayOrder == null) return b.displayOrder == null ? 0 : 1;
    if (b.displayOrder == null) return -1;
    return a.displayOrder - b.displayOrder;
  });
}
// Match copy width to the image painted inside the responsive contain frame.
function imageCopyWidth(item: ContentDocument) {
  const dimensions = item.mainImage?.asset?._ref.match(/-(\d+)x(\d+)-[^-]+$/);
  if (!dimensions) return "var(--sales-image-width, 80%)";
  const crop = item.mainImage?.crop;
  const width = Number(dimensions[1]) * (1 - (crop?.left ?? 0) - (crop?.right ?? 0));
  const height = Number(dimensions[2]) * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0));
  return width > 0 && height > 0 ? `min(var(--sales-image-width, 80%), calc(var(--sales-image-width, 80%) * ${width / height} / var(--sales-frame-ratio, 1.333333)))` : "var(--sales-image-width, 80%)";
}
export function SalesGrid({ items, alignImageCopy = false }: { items: ContentDocument[]; alignImageCopy?: boolean }) {
  return <ul className={`sales-grid${alignImageCopy ? " sales-grid--image-aligned" : ""}${items.length === 1 ? " sales-grid--single" : ""}`}>{items.map((item) => <li key={item._id}><Link href={`/sales/${encodeURIComponent(item.slug)}`}>
    <div className="sales-grid-image"><ContentVisual src={imageUrl(item.mainImage, 900)} alt={item.title} /></div>
    </Link><div className="sales-grid-copy" style={alignImageCopy ? { width: imageCopyWidth(item) } : undefined}>
      <h2><Link href={`/sales/${encodeURIComponent(item.slug)}`}>{item.title}</Link></h2>
      {item.artist?.name && <p>{item.artist.slug ? <Link href={`/artists/${encodeURIComponent(item.artist.slug)}`}>{item.artist.name}</Link> : item.artist.name}</p>}
      <p className="sales-grid-price">{artworkPrice(item.price)}</p>
      <SalesStatus value={item.availability} />
    </div>
  </li>)}</ul>;
}
