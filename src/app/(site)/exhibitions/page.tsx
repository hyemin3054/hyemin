import Link from "next/link";
import { Divider } from "@/components/Divider";
import { ExhibitionImage } from "@/components/ExhibitionImage";
import { getContentList } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";
import type { ContentDocument } from "@/sanity/lib/types";
import "@/styles/exhibitions.css";

function Dates({ item }: { item: ContentDocument }) {
  if (!item.startDate && !item.endDate) return null;
  return <p className="exhibition-dates">{item.startDate && <time dateTime={item.startDate}>{item.startDate.replaceAll("-", ".")}</time>}{item.startDate && item.endDate && " — "}{item.endDate && <time dateTime={item.endDate}>{item.endDate.replaceAll("-", ".")}</time>}</p>;
}
const href = (item: ContentDocument) => `/exhibitions/${encodeURIComponent(item.slug)}`;

export const metadata = { title: "Exhibitions" };
export default async function Page() {
  const result = await getContentList("exhibition");
  const sorted = [...result.data].sort((a, b) => {
    const order = (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity);
    return (Number.isNaN(order) ? 0 : order) || (b.startDate || b.endDate || "").localeCompare(a.startDate || a.endDate || "") || a._id.localeCompare(b._id);
  });
  const current = sorted.filter((item) => item.status === "current");
  const archive = sorted.filter((item) => item.status === "archive");
  return <section className="container exhibitions-page">
    <p className="exhibitions-eyebrow">EXHIBITIONS / ARCHIVE</p><h1>Exhibitions</h1><Divider />
    {result.status !== "ready" ? <p className="exhibitions-error">콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p> : <>
      <section className="exhibitions-current" aria-labelledby="current-title"><h2 id="current-title">CURRENT</h2>
        {current.length ? current.map((item) => <article className="exhibition-current-row" key={item._id}>
          <div className="exhibition-current-copy"><h3><Link href={href(item)}>{item.title}</Link></h3>
            {item.artist?.name && <p className="exhibition-artist">{item.artist.name}</p>}
            <Dates item={item} />
            {item.shortDescription?.trim() && <p className="exhibition-summary preserve-lines">{item.shortDescription}</p>}
          </div>
          <Link href={href(item)} className="exhibition-current-image" aria-label={`${item.title} 전시 상세`}><ExhibitionImage src={imageUrl(item.mainImage)} alt={item.title} /></Link>
        </article>) : <p className="exhibition-empty">현재 진행 중인 전시가 없습니다.</p>}
      </section>
      <section className="exhibitions-archive" aria-labelledby="archive-title"><h2 id="archive-title">ARCHIVE</h2>
        {archive.length ? <div className="exhibition-archive-grid">{archive.map((item) => <article key={item._id}>
          <Link href={href(item)} className="exhibition-archive-link">
            <div className="exhibition-archive-image"><ExhibitionImage src={imageUrl(item.mainImage, 900)} alt={item.title} /></div>
            <h3>{item.title}</h3>
            {item.artist?.name && <p className="exhibition-artist">{item.artist.name}</p>}
            <Dates item={item} />
          </Link>
        </article>)}</div> : <p className="exhibition-empty">등록된 지난 전시가 없습니다.</p>}
      </section>
    </>}
  </section>;
}
