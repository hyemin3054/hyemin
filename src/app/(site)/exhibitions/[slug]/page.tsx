import Link from "next/link";
import { exhibitionImages } from "@/lib/exhibition-images";
import { ExhibitionGallery } from "@/components/ExhibitionGallery";
import { groupExhibitions } from "@/lib/exhibitions";
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
export const metadata = { title: "Exhibition" };
export default async function DetailPage({ params }: Props) {
  const { slug } = await params;
  const [result, list] = await Promise.all([getContentDetail("exhibition", slug), getContentList("exhibition")]);
  if (result.status !== "ready") return <section className="container ex-detail"><Link href="/exhibitions">EXHIBITIONS / ARCHIVE</Link><p>콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p></section>;
  const item = result.data;
  if (!item) notFound();
  const gallery = exhibitionImages(item.mainImage, item.galleryImages).filter(image => imageUrl(image));
  const hasDescription = Array.isArray(item.description) && item.description.length > 0;
  const groups = groupExhibitions(list.data);
  const archive = groups.archive.filter(entry => entry._id !== item._id).slice(0, 8);
  const status = groups.past?._id === item._id ? "PAST" : groups.archive.some(entry => entry._id === item._id) ? "ARCHIVE" : groups.current.some(entry => entry._id === item._id) ? "CURRENT" : item.status === "upcoming" ? "UPCOMING" : null;
  return <article className="container ex-detail">
    <Link className="ex-detail-eyebrow" href={status === "ARCHIVE" ? "/exhibitions#archive" : "/exhibitions"}>{status === "ARCHIVE" ? "ARCHIVE" : "EXHIBITION"}</Link>
    {status && <p className="ex-detail-status">{status}</p>}<Divider />
    <div className="ex-detail-layout">
    <section className="ex-detail-heading" aria-label="전시 정보">
      <div className="ex-detail-copy"><h1 className="ex-detail-title">{item.title}</h1>
        {item.artist?.name && <p className="ex-detail-artist">{item.artist.slug ? <Link href={`/artists/${encodeURIComponent(item.artist.slug)}`}>{item.artist.name}</Link> : item.artist.name}</p>}
        <Period item={item} />
        {item.shortDescription?.trim() && <p className="ex-detail-summary preserve-lines">{item.shortDescription}</p>}
      </div>

    </section>
    <ExhibitionGallery title={item.title} images={gallery.map(image => ({ src: imageUrl(image, 1600)!, fullSrc: imageUrl({ asset: image.asset }, 3000)!, title: image.title, year: image.year, medium: image.medium, size: image.size }))} />
    {hasDescription && <section className="ex-detail-description" aria-label="상세 전시 설명"><PortableText value={item.description!} /></section>}
    </div>
    {archive.length > 0 && <section className="ex-detail-archive" aria-labelledby="ex-archive-title"><h2 id="ex-archive-title">ARCHIVE</h2>
      <div className="ex-detail-archive-grid">{archive.map((entry) => <Link key={entry._id} href={`/exhibitions/${encodeURIComponent(entry.slug)}`}>
        <div className="ex-detail-archive-image"><ExhibitionImage src={imageUrl(entry.mainImage, 700)} alt={entry.title} /></div>
        <h3>{entry.title}</h3>{entry.artist?.name && <p>{entry.artist.name}</p>}<Period item={entry} />
      </Link>)}</div>
    </section>}
  </article>;
}
