import Link from "next/link";
import { PortableText } from "next-sanity";
import { imageUrl } from "@/sanity/lib/image";
import type { ContentDocument, ContentImage, HistoryEntry } from "@/sanity/lib/types";

export function CmsImage({ image }: { image?: ContentImage | null }) {
  const url = imageUrl(image);
  if (!url) return null;
  return <figure><img src={url} alt="" loading="lazy" /></figure>;
}

export function HistoryList({ title, entries }: { title: string; entries?: HistoryEntry[] | null }) {
  const rows = (entries || []).filter((entry) => entry && (entry.year?.trim() || entry.description?.trim()));
  if (!rows.length) return null;
  return <section><h2>{title}</h2><ul>{rows.map((entry, index) => <li className="preserve-lines" key={entry._key || index}>{[entry.year, entry.description].filter(Boolean).join(" · ")}</li>)}</ul></section>;
}

export function ContentInfo({ item }: { item: ContentDocument }) {
  const exhibitionStatus = { current: "현재 전시", upcoming: "예정 전시", archive: "지난 전시" };
  const availability = { available: "구매 가능", reserved: "예약됨", sold: "판매 완료" };
  return <div className="stack-small">
    {item.artist?.name && <p>작가: {item.artist.slug ? <Link href={`/artists/${encodeURIComponent(item.artist.slug)}`}>{item.artist.name}</Link> : item.artist.name}</p>}
    {item._type === "exhibition" && <>
      {(item.startDate || item.endDate) && <p>전시 기간: {item.startDate && <time dateTime={item.startDate}>{item.startDate}</time>}{item.startDate && item.endDate && " ~ "}{item.endDate && <><span>{!item.startDate && "종료 "}</span><time dateTime={item.endDate}>{item.endDate}</time></>}</p>}
      {item.status && exhibitionStatus[item.status] && <p>{exhibitionStatus[item.status]}</p>}
    </>}
    {item._type === "news" && item.date && <p>게시일: <time dateTime={item.date}>{item.date}</time></p>}
    {item._type === "salesArtwork" && <>
      {item.year && <p>제작 연도: {item.year}</p>}
      {item.medium && <p>재료 / 기법: {item.medium}</p>}
      {item.dimensions && <p>크기: {item.dimensions}</p>}
      <p>{item.price == null ? "가격 문의" : `${item.price.toLocaleString("ko-KR")}원`}</p>
      {item.availability && availability[item.availability] && <p>{availability[item.availability]}</p>}
    </>}
  </div>;
}

export function ContentCard({ item, basePath }: { item: ContentDocument; basePath: string }) {
  const candidates = item._type === "artist" ? [item.representativeImage, item.portrait]
    : [item.mainImage];
  const image = candidates.find((candidate) => imageUrl(candidate));
  return <li className="card-copy"><Link href={`${basePath}/${encodeURIComponent(item.slug)}`}>{item.title}</Link>
    <CmsImage image={image} />{item._type === "salesArtwork" ? <>{item.artist?.name && <p>{item.artist.name}</p>}<p>{item.price == null ? "가격 문의" : `${item.price.toLocaleString("ko-KR")}원`}</p></> : <ContentInfo item={item} />}
    {(item.shortBio || item.shortDescription || item.excerpt) && <p className="preserve-lines">{item.shortBio || item.shortDescription || item.excerpt}</p>}
  </li>;
}

export function ContentBody({ item }: { item: ContentDocument }) {
  const body = item._type === "artist" ? item.fullBio : item._type === "news" ? item.body : item.description;
  // Artist retains both image roles; other content uses one main image.
  const images = item._type === "artist" ? [["작가 프로필 사진", item.portrait], ["목록 대표 이미지", item.representativeImage]] as const
    : item._type === "exhibition" ? [["전시 대표 이미지", item.mainImage]] as const
    : item._type === "news" ? [["대표 이미지", item.mainImage]] as const
    : [["작품 이미지", item.mainImage]] as const;
  const works = (item.works || []).filter((work) => work && (imageUrl(work.image) || work.title?.trim() || work.year?.trim() || work.description?.trim()));
  return <>
    <ContentInfo item={item} />
    {(item.shortBio || item.excerpt || item.shortDescription) && <p className="preserve-lines">{item.shortBio || item.excerpt || item.shortDescription}</p>}
    {images.map(([label, image]) => imageUrl(image) ? <section key={label}><h2>{label}</h2><CmsImage image={image} /></section> : null)}
    {Array.isArray(body) && body.length > 0 && <PortableText value={body} />}
    {(item._type === "exhibition" || item._type === "news" ? item.galleryImages || [] : []).filter(Boolean).map((image, index) => <CmsImage key={image._key || index} image={image} />)}
    {works.length > 0 && <section><h2>작품</h2>{works.map((work, index) => <section key={work._key || index}><CmsImage image={work.image} />{work.title && <h3>{work.title}</h3>}{work.year && <p>{work.year}</p>}{work.description && <p className="preserve-lines">{work.description}</p>}</section>)}</section>}
    <HistoryList title="주요 전시 이력" entries={item.selectedExhibitions} />
    <HistoryList title="학력" entries={item.education} />
    <HistoryList title="수상 내역" entries={item.awards} />
    {item._type === "salesArtwork" && <Link href="/about#contact">구매 문의 · Contact</Link>}
  </>;
}
