import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { getContentDetail, getContentList } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";
import { SalesGrid, sortArtworks, artworkPrice } from "@/components/SalesGrid";
import { ContentVisual } from "@/components/ContentVisual";
import { Divider } from "@/components/Divider";
import "@/styles/sales.css";

type Props = { params: Promise<{ slug: string }> };
export const metadata = { title: "Available Works" };
export default async function DetailPage({ params }: Props) {
  const { slug } = await params;
  const [result, list] = await Promise.all([getContentDetail("salesArtwork", slug), getContentList("salesArtwork")]);
  if (result.status !== "ready") return <section className="container sales-page"><p>콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p></section>;
  const item = result.data;
  if (!item) notFound();
  const related = sortArtworks(list.data).filter((entry) => entry._id !== item._id).slice(0, 8);
  const availability = item.availability && { available: "Available", reserved: "Reserved", sold: "Sold" }[item.availability];
  const facts = [["Year", item.year], ["Medium", item.medium], ["Dimensions", item.dimensions]].filter(([, value]) => value?.trim());
  return <article className="container sales-page sales-detail"><p className="sales-eyebrow">SALES</p><p className="sales-section-title">Available Works</p><Divider />
    <section className="sales-artwork" aria-label="작품 정보"><h1>{item.title}</h1>
      {item.artist?.name && <p className="sales-artwork-artist">{item.artist.slug ? <Link href={`/artists/${encodeURIComponent(item.artist.slug)}`}>{item.artist.name}</Link> : item.artist.name}</p>}
      <div className="sales-main-image"><ContentVisual src={imageUrl(item.mainImage, 1420)} alt={item.title} /></div>
      {item.price != null && <p className="sales-artwork-price">{artworkPrice(item.price)}</p>}
      {availability && <p className="sales-availability">{availability}</p>}
      {facts.length > 0 && <dl className="sales-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
      {Array.isArray(item.description) && item.description.length > 0 && <div className="sales-description"><PortableText value={item.description} /></div>}
    </section>
    {related.length > 0 && <section className="sales-related" aria-label="다른 작품"><SalesGrid items={related} /></section>}
  </article>;
}
