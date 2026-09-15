import Link from "next/link";
import type { ContentDocument } from "@/sanity/lib/types";
import { imageUrl } from "@/sanity/lib/image";
import { ContentVisual } from "./ContentVisual";
export const artworkPrice = (price?: number | null) => price == null ? "가격 문의" : `₩ ${price.toLocaleString("ko-KR")}`;
export function sortArtworks(items: ContentDocument[]) {
  return [...items].sort((a, b) => {
    if (a.displayOrder == null) return b.displayOrder == null ? 0 : 1;
    if (b.displayOrder == null) return -1;
    return a.displayOrder - b.displayOrder;
  });
}
export function SalesGrid({ items }: { items: ContentDocument[] }) {
  return <ul className="sales-grid">{items.map((item) => <li key={item._id}><Link href={`/sales/${encodeURIComponent(item.slug)}`}>
    <div className="sales-grid-image"><ContentVisual src={imageUrl(item.mainImage, 900)} alt={item.title} /></div>
    <h2>{item.title}</h2>{item.artist?.name && <p>{item.artist.name}</p>}<p className="sales-grid-price">{artworkPrice(item.price)}</p>
  </Link></li>)}</ul>;
}
