import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { getContentDetail, getContentList } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";
import { ArtistDetailImage } from "@/components/ArtistDetailImage";
import type { HistoryEntry } from "@/sanity/lib/types";
import "@/styles/artist-detail.css";

function History({ entries }: { entries: HistoryEntry[] }) {
  return <ul className="artist-history-list">{entries.map((entry, index) => <li key={entry._key || index}>
    {entry.year?.trim() && <span>{entry.year}</span>}
    {entry.description?.trim() && <span className="preserve-lines">{entry.description}</span>}
  </li>)}</ul>;
}
const historyRows = (entries?: HistoryEntry[] | null) => (entries || []).filter((entry) => entry && (entry.year?.trim() || entry.description?.trim()));

type Props = { params: Promise<{ slug: string }> };
export const metadata = { title: "Artists" };
export default async function DetailPage({ params }: Props) {
  const { slug } = await params;
  const [result, list] = await Promise.all([getContentDetail("artist", slug), getContentList("artist")]);
  if (result.status !== "ready") return <section className="container artist-detail"><Link href="/artists">← ARTISTS</Link><p>콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p></section>;
  const artist = result.data;
  if (!artist) notFound();
  const index = list.data.findIndex((item) => item._id === artist._id);
  const previous = index > 0 ? list.data[index - 1] : null;
  const next = index >= 0 ? list.data[index + 1] : null;
  const works = (artist.works || []).filter((work) => work && (imageUrl(work.image) || work.title?.trim() || work.year?.trim() || work.description?.trim()));
  const exhibitions = historyRows(artist.selectedExhibitions);
  const education = historyRows(artist.education);
  const awards = historyRows(artist.awards);
  const name = artist.name || artist.title;
  const representativeImage = imageUrl(artist.representativeImage);
  const representativeWork = works.find(work => work.image?.asset?._ref && work.image.asset._ref === artist.representativeImage?.asset?._ref);
  return <article className="container artist-detail">
    <Link className="artist-back" href="/artists">← ARTISTS</Link>
    <section className="artist-intro" aria-label="작가 소개">
      <div className="artist-intro-copy">
        <p className="artist-label">ARTIST</p>
        <h1>{name}</h1>
        {artist.shortBio?.trim() && <p className="artist-summary preserve-lines">{artist.shortBio}</p>}
        {Array.isArray(artist.fullBio) && artist.fullBio.length > 0 && <div className="artist-biography"><PortableText value={artist.fullBio} /></div>}
      </div>
      <div className="artist-portrait"><ArtistDetailImage src={imageUrl(artist.portrait)} alt={`${name} 프로필 사진`} /></div>
    </section>
    {(representativeImage || works.length > 0) && <section className="artist-works" aria-labelledby="artist-works-title">
      <h2 id="artist-works-title">Works</h2>
      {representativeImage && <figure className="artist-representative" aria-label="대표 작품">
        <ArtistDetailImage src={representativeImage} alt={`${name} 대표 작품`} />
        {(representativeWork || artist.representativeImageDescription?.trim()) && <figcaption>
          {representativeWork?.title?.trim() && <p className="artist-work-title">{representativeWork.title}</p>}
          {representativeWork?.year?.trim() && <p>{representativeWork.year}</p>}
          {(representativeWork?.description?.trim() || artist.representativeImageDescription?.trim()) && <p className="preserve-lines">{representativeWork?.description?.trim() || artist.representativeImageDescription}</p>}
        </figcaption>}
      </figure>}
      <div className="artist-works-grid">{works.map((work, i) => <figure className="artist-work" key={work._key || i}>
        <div className="artist-work-image"><ArtistDetailImage src={imageUrl(work.image)} alt={work.title || `${name} 작품 ${i + 1}`} /></div>
        {(work.title?.trim() || work.year?.trim() || work.description?.trim()) && <figcaption>
          {(work.title?.trim() || work.year?.trim()) && <p>{[work.title?.trim(), work.year?.trim()].filter(Boolean).join(", ")}</p>}
          {work.description?.trim() && <p className="artist-work-description preserve-lines">{work.description}</p>}
        </figcaption>}
      </figure>)}</div>
    </section>}
    {(exhibitions.length > 0 || education.length > 0 || awards.length > 0) && <section className="artist-history" aria-label="작가 이력">
      {exhibitions.length > 0 && <section><p className="artist-label">EXHIBITIONS</p><h2>Selected Exhibitions</h2><History entries={exhibitions} /></section>}
      {(education.length > 0 || awards.length > 0) && <section className="artist-cv"><p className="artist-label">CV</p><h2>Education &amp; Awards</h2>
        {education.length > 0 && <section aria-label="학력"><History entries={education} /></section>}
        {awards.length > 0 && <section aria-label="수상"><History entries={awards} /></section>}
      </section>}
    </section>}
    {(previous || next) && <nav className="artist-pagination" aria-label="이전 다음 작가">
      {previous && <Link href={`/artists/${encodeURIComponent(previous.slug)}`} aria-label={`이전 작가: ${previous.name || previous.title}`}>← PREVIOUS ARTIST</Link>}
      {next && <Link className="artist-next" href={`/artists/${encodeURIComponent(next.slug)}`} aria-label={`다음 작가: ${next.name || next.title}`}>NEXT ARTIST →</Link>}
    </nav>}
  </article>;
}
