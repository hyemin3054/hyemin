import Link from "next/link";
import { ContentVisual } from "@/components/ContentVisual";
import { getContentList, getSiteSettings } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";
import "@/styles/home.css";

export default async function HomePage() {
  const [exhibitions, settings] = await Promise.all([getContentList("exhibition"), getSiteSettings()]);
  const sorted = [...exhibitions.data].sort((a, b) => {
    const order = (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity);
    return (Number.isNaN(order) ? 0 : order) || (b.startDate || "").localeCompare(a.startDate || "") || a._id.localeCompare(b._id);
  });
  const current = sorted.find(item => item.status === "current");
  const archive = sorted.filter(item => item.status === "archive").slice(0, 4);
  const logo = imageUrl(settings.data?.logo, 1200);
  return <div className="home-page">
    <div className="home-hero">
      <div className="home-hero-image"><ContentVisual src={imageUrl(settings.data?.aboutImages?.[0], 1800)} alt="The Grotto Art Window 갤러리 공간" /></div>
      {logo && <div className="home-wordmark" role="img" aria-label="The Grotto Art Window"><img src={logo} alt="" /></div>}
    </div>
    <a className="home-current-anchor" href="#current-exhibition">↓<br />CURRENT EXHIBITION</a>
    <section id="current-exhibition" className="home-current" aria-labelledby="home-current-label">
      <div className="home-current-copy"><h2 id="home-current-label">CURRENT EXHIBITION</h2>
        {current ? <><h1><Link href={`/exhibitions/${encodeURIComponent(current.slug)}`}>{current.title}</Link></h1>
          {current.artist?.name && <p>{current.artist.name}</p>}
          {(current.startDate || current.endDate) && <p>{[current.startDate, current.endDate].filter(Boolean).map(date => date!.replaceAll("-", ".")).join(" — ")}</p>}
        </> : <p>{exhibitions.status === "ready" ? "현재 진행 중인 전시가 없습니다." : "전시 정보를 불러오지 못했습니다. 잠시 후 다시 확인해주세요."}</p>}
      </div>
      {current && <Link className="home-current-image" href={`/exhibitions/${encodeURIComponent(current.slug)}`} aria-label={`${current.title} 전시 상세`}><ContentVisual src={imageUrl(current.mainImage, 1500)} alt={current.title || "현재 전시"} /></Link>}
    </section>
    {archive.length > 0 && <section className="container home-archive" aria-labelledby="home-archive-title">
      <div className="home-archive-heading"><h2 id="home-archive-title">ARCHIVE</h2><Link href="/exhibitions">VIEW ARCHIVE →</Link></div>
      <div className="home-archive-grid">{archive.map(item => <Link key={item._id} href={`/exhibitions/${encodeURIComponent(item.slug)}`}>
        <div className="home-archive-image"><ContentVisual src={imageUrl(item.mainImage, 900)} alt={item.title || "지난 전시"} /></div>
        <h3>{item.title}</h3>{item.artist?.name && <p>{item.artist.name}</p>}
        {(item.startDate || item.endDate) && <p>{[item.startDate, item.endDate].filter(Boolean).map(date => date!.replaceAll("-", ".")).join(" — ")}</p>}
      </Link>)}</div>
    </section>}
  </div>;
}
