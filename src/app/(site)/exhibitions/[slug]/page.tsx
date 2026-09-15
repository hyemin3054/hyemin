import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { Divider } from "@/components/Divider";
import { ExhibitionImage } from "@/components/ExhibitionImage";
import { getContentDetail, getContentList } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";
import type { ContentDocument } from "@/sanity/lib/types";
import "@/styles/exhibition-detail.css";

function Period({ item }: { item: ContentDocument }) {
  if (!item.startDate && !item.endDate) return null;
  return <p className="ex-detail-period">{item.startDate && <time dateTime={item.startDate}>{item.startDate.replaceAll("-", ".")}</time>}{item.startDate && item.endDate && " — "}{item.endDate && <time dateTime={item.endDate}>{item.endDate.replaceAll("-", ".")}</time>}</p>;
}

type Props = { params: Promise<{ slug: string }> };
export const metadata = { title: "Exhibitions" };
export default async function DetailPage({ params }: Props) {
  const { slug } = await params;
  const [result, list] = await Promise.all([getContentDetail("exhibition", slug), getContentList("exhibition")]);
  if (result.status !== "ready") return <section className="container ex-detail"><Link href="/exhibitions">EXHIBITIONS / ARCHIVE</Link><p>콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p></section>;
  const item = result.data;
  if (!item) notFound();
  const gallery = (item.galleryImages || []).filter((image) => imageUrl(image));
  const hasDescription = Array.isArray(item.description) && item.description.length > 0;
  const archive = list.data.filter((entry) => entry.status === "archive" && entry._id !== item._id)
    .sort((a, b) => (b.startDate || b.endDate || "").localeCompare(a.startDate || a.endDate || "") || a._id.localeCompare(b._id)).slice(0, 6);
  const status = item.status && { current: "CURRENT", upcoming: "UPCOMING", archive: "ARCHIVE" }[item.status];
  return <article className="container ex-detail">
    <Link className="ex-detail-eyebrow" href="/exhibitions">EXHIBITIONS / ARCHIVE</Link>
    <h1>Exhibitions</h1><Divider />
    {status && <p className="ex-detail-status">{status}</p>}
    <section className="ex-detail-intro" aria-label="전시 정보">
      <div className="ex-detail-copy"><h2>{item.title}</h2>
        {item.artist?.name && <p className="ex-detail-artist">{item.artist.slug ? <Link href={`/artists/${encodeURIComponent(item.artist.slug)}`}>{item.artist.name}</Link> : item.artist.name}</p>}
        <Period item={item} />
        {item.shortDescription?.trim() && <p className="ex-detail-summary preserve-lines">{item.shortDescription}</p>}
      </div>
      <div className="ex-detail-main-image"><ExhibitionImage src={imageUrl(item.mainImage, 1480)} alt={item.title} /></div>
    </section>
    {(hasDescription || gallery.length > 0) && <div className="ex-detail-content">
      {hasDescription && <section className="ex-detail-description" aria-label="상세 전시 설명"><PortableText value={item.description!} /></section>}
      {gallery.length > 0 && <section className="ex-detail-gallery" aria-labelledby="ex-gallery-title">
        <h2 id="ex-gallery-title">WORKS</h2>
        <div className="ex-detail-gallery-grid">{gallery.map((image, i) => <figure key={image._key || i}>
          <ExhibitionImage src={imageUrl(image, 900)} alt={`${item.title} 전시 이미지 ${i + 1}`} />
        </figure>)}</div>
      </section>}
    </div>}
    {archive.length > 0 && <section className="ex-detail-archive" aria-labelledby="ex-archive-title"><h2 id="ex-archive-title">ARCHIVE</h2>
      <div className="ex-detail-archive-grid">{archive.map((entry) => <Link key={entry._id} href={`/exhibitions/${encodeURIComponent(entry.slug)}`}>
        <div className="ex-detail-archive-image"><ExhibitionImage src={imageUrl(entry.mainImage, 700)} alt={entry.title} /></div>
        <h3>{entry.title}</h3>{entry.artist?.name && <p>{entry.artist.name}</p>}<Period item={entry} />
      </Link>)}</div>
    </section>}
  </article>;
}
