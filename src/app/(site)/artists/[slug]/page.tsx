import Link from "next/link";
import { artistArtworks, artworkCaption } from "@/lib/artist-artworks";
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
  const { main, mainWork, additional: works } = artistArtworks(artist);
  const mainCaption = artworkCaption(main, mainWork);
  const viewerImages = [{ image: main, work: mainWork }, ...works.map(work => ({ image: work.image, work }))].flatMap(({ image, work }) => {
    const src = imageUrl(image);
    return src ? [{ src, fullSrc: imageUrl(image, 3000) || src, title: image?.title || work?.title || artist.name, caption: [[image?.title || work?.title, image?.year || work?.year].filter(Boolean).join(", "), [image?.medium, image?.size].filter(Boolean).join(", ") || work?.description?.trim()].filter((line): line is string => Boolean(line)) }] : [];
  });
  const captionDescription = (mainWork?.description || (main?.asset?._ref === artist.representativeImage?.asset?._ref ? artist.representativeImageDescription : ""))?.trim();
  const showDescription = captionDescription && !mainCaption.includes(captionDescription);
  const exhibitions = historyRows(artist.selectedExhibitions);
  const education = historyRows(artist.education);
  const awards = historyRows(artist.awards);
  const name = artist.name || artist.title;
  const biography = (artist.fullBio || []).filter(block => block._type !== "block" || block.children?.some(child => child.text?.trim()));
  const biographyText = biography.map(block => (block.children || []).map(child => child.text || "").join("")).join(" ").replace(/\s+/g, " ").trim();
  const summary = artist.shortBio?.trim();
  const showSummary = summary && !biographyText.includes(summary.replace(/\s+/g, " "));

  return <article className="container artist-detail">
    <Link className="artist-back" href="/artists">← ARTISTS</Link>
    <section className="artist-intro" aria-label="작가 소개">
      <div className="artist-intro-copy">
        <p className="artist-label">ARTIST</p>
        <h1>{name}</h1>
        {showSummary && <p className="artist-summary preserve-lines">{summary}</p>}
        {biography.length > 0 && <div className="artist-biography"><PortableText value={biography} /></div>}

      </div>
      <figure className="artist-main-artwork">
        <div className="artist-main-image"><ArtistDetailImage images={viewerImages} src={imageUrl(main)} alt={main?.title || mainWork?.title || name + " 대표 작품"} /></div>
        {(mainCaption.length > 0 || showDescription) && <figcaption>
          {mainCaption.map((line, i) => <p key={i}>{line}</p>)}
          {showDescription && <p className="preserve-lines">{captionDescription}</p>}
        </figcaption>}
      </figure>
    </section>
    {works.length > 0 && <section className="artist-works" aria-labelledby="artist-works-title">
      <h2 id="artist-works-title">Additional Works</h2>
      <div className="artist-works-grid">{works.map((work, i) => <figure className="artist-work" key={work._key || i}>
        <div className="artist-work-image"><ArtistDetailImage images={viewerImages} initialIndex={Math.max(0, viewerImages.findIndex(image => image.src === imageUrl(work.image)))} src={imageUrl(work.image)} alt={work.title || `${name} 작품 ${i + 1}`} /></div>
        {(artworkCaption(work.image, work).length > 0 || work.description?.trim()) && <figcaption>
          {artworkCaption(work.image, work).map((line, index) => <p key={index}>{line}</p>)}
          {work.description?.trim() && <p className="artist-work-description preserve-lines">{work.description}</p>}
        </figcaption>}
      </figure>)}</div>
    </section>}
    {(exhibitions.length > 0 || education.length > 0 || awards.length > 0) && <section className="artist-history" aria-labelledby="artist-cv-title"><h2 id="artist-cv-title">CV</h2><div className="artist-history-columns">
      {exhibitions.length > 0 && <section><h3>Selected Exhibitions</h3><History entries={exhibitions} /></section>}
      {(education.length > 0 || awards.length > 0) && <section className="artist-cv"><h3>Education &amp; Awards</h3>
        {education.length > 0 && <section aria-label="학력"><History entries={education} /></section>}
        {awards.length > 0 && <section aria-label="수상"><History entries={awards} /></section>}
      </section>}
    </div></section>}
    {(previous || next) && <nav className="artist-pagination" aria-label="이전 다음 작가">
      {previous && <Link href={`/artists/${encodeURIComponent(previous.slug)}`} aria-label={`이전 작가: ${previous.name || previous.title}`}>← PREVIOUS ARTIST</Link>}
      {next && <Link className="artist-next" href={`/artists/${encodeURIComponent(next.slug)}`} aria-label={`다음 작가: ${next.name || next.title}`}>NEXT ARTIST →</Link>}
    </nav>}
  </article>;
}
