import Link from "next/link";
import { SalesStatus } from "@/components/SalesStatus";
import { SalesPageHeader, PurchaseContact } from "@/components/SalesPageHeader";
import { notFound } from "next/navigation";
import { getContentDetail, getSiteSettings } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";
import { artworkPrice } from "@/components/SalesGrid";
import { ArtworkViewer } from "@/components/ArtworkViewer";
import { Divider } from "@/components/Divider";
import "@/styles/sales.css";

type Props = { params: Promise<{ slug: string }> };
export const metadata = { title: "Sales" };
export default async function DetailPage({ params }: Props) {
  const { slug } = await params;
  const [result, settings] = await Promise.all([getContentDetail("salesArtwork", slug), getSiteSettings()]);
  if (result.status !== "ready") return <section className="container sales-page"><p>콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p></section>;
  const item = result.data;
  if (!item) notFound();
  const facts = [["Year", item.year], ["Dimensions", item.dimensions], ["Medium", item.medium], ["Price", item.price != null ? artworkPrice(item.price) : null]].filter(([, value]) => typeof value === "string" && value.trim());
  return <article className="container sales-page sales-detail"><SalesPageHeader settings={settings.data} detail /><Divider />
    <section className="sales-artwork" aria-label="작품 정보"><div className="sales-artwork-copy"><h1>{item.title}</h1>
      {item.artist?.name && <p className="sales-artwork-artist">{item.artist.slug ? <Link href={`/artists/${encodeURIComponent(item.artist.slug)}`}>{item.artist.name}</Link> : item.artist.name}</p>}
      <dl className="sales-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd className={label === "Year" ? "sales-year-value" : label === "Price" ? "sales-artwork-price" : undefined}>{value}</dd></div>)}
        {item.availability && <div><dt>Status</dt><dd><SalesStatus value={item.availability} /></dd></div>}
      </dl>
      <PurchaseContact settings={settings.data} /></div>
      <div className="sales-main-image"><ArtworkViewer contact={<PurchaseContact settings={settings.data} />} images={imageUrl(item.mainImage) ? [{ src: imageUrl(item.mainImage)!, fullSrc: imageUrl(item.mainImage, 3000) || undefined, title: item.title, year: item.year, medium: item.medium, size: item.dimensions }] : []} fullSrc={imageUrl(item.mainImage, 3000) || undefined} src={imageUrl(item.mainImage, 1420)} alt={item.title} /></div>
    </section>
  </article>;
}
