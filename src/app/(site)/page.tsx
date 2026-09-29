import Link from "next/link";
import { CurrentExhibitionLink } from "@/components/CurrentExhibitionLink";
import { exhibitionImages } from "@/lib/exhibition-images";
import { ExhibitionGallery } from "@/components/ExhibitionGallery";
import { ImageCarousel } from "@/components/ImageCarousel";
import { groupExhibitions } from "@/lib/exhibitions";
import { ContentVisual } from "@/components/ContentVisual";
import { getContentList, getSiteSettings } from "@/sanity/lib/content";
import { imageUrl, previewImageUrl } from "@/sanity/lib/image";
import "@/styles/home.css";

export default async function HomePage() {
  const [exhibitions, settings] = await Promise.all([getContentList("exhibition"), getSiteSettings()]);
  const { current: ongoing, past, archive } = groupExhibitions(exhibitions.data);
  const current = ongoing[0];
  const heroImages = (settings.data?.heroImages || []).map(image => previewImageUrl(image, 1440, 530)).filter((src): src is string => Boolean(src));
  if (!heroImages.length) { const fallback = previewImageUrl(settings.data?.aboutImages?.[0], 1440, 530); if (fallback) heroImages.push(fallback); }
  const renderExhibition = (item: typeof current, past = false) => <section id={past ? "past-exhibition" : "current-exhibition"} className="home-current" aria-label={past ? "지난 전시" : "현재 전시"}>
    <ExhibitionGallery label={past ? <h2 className="home-past-label">PAST</h2> : undefined} href={item ? `/exhibitions/${encodeURIComponent(item.slug)}` : undefined} layout="home" title={item?.title || "현재 전시"} images={item ? exhibitionImages(item.mainImage, item.galleryImages).map(image => ({ ...image, src: imageUrl(image, 1500)!, fullSrc: imageUrl({asset: image.asset}, 3000)! })) : []} information={<div className="home-current-copy">
      {item ? <><h1><Link href={"/exhibitions/" + encodeURIComponent(item.slug)}>{item.title}</Link></h1>
        {item.artist?.name && <p>{item.artist.name}</p>}
        {(item.startDate || item.endDate) && <p>{[item.startDate, item.endDate].filter(Boolean).map(date => date!.replaceAll("-", ".")).join(" — ")}</p>}
        {item.shortDescription?.trim() && <p className="home-current-summary">{item.shortDescription}</p>}
      </> : <p>{exhibitions.status === "ready" ? "현재 진행 중인 전시가 없습니다." : "전시 정보를 불러오지 못했습니다. 잠시 후 다시 확인해주세요."}</p>}
    </div>} />
  </section>;
  return <div id="home-top" className="home-page">
    <section className="home-hero-screen" aria-label="갤러리 전경">
      <div className="home-hero"><ImageCarousel images={heroImages} frameClass="home-hero-image" alt="The Grotto Art Window 전시 전경" autoPlay />
        <div className="home-hero-wordmark"><span>The Grotto</span><span>Art Window</span></div>
      </div>
      <CurrentExhibitionLink />
    </section>
    {renderExhibition(current)}
    {past && renderExhibition(past, true)}
    {<section id="archive" className="container home-archive" aria-labelledby="home-archive-title">
      <div className="home-archive-heading"><h2 id="home-archive-title">ARCHIVE</h2></div>
      {archive.length === 0 && <p className="muted">{exhibitions.status === "ready" ? "등록된 지난 전시가 없습니다." : "지난 전시 정보를 불러오지 못했습니다."}</p>}
      <div className="home-archive-grid">{archive.map(item => <Link key={item._id} href={`/exhibitions/${encodeURIComponent(item.slug)}`}>
        <div className="home-archive-image"><ContentVisual src={previewImageUrl(item.mainImage, 840, 1188)} alt={item.title || "지난 전시"} /></div>
        <h3>{item.title}</h3>{item.artist?.name && <p>{item.artist.name}</p>}
        {(item.startDate || item.endDate) && <p>{[item.startDate, item.endDate].filter(Boolean).map(date => date!.replaceAll("-", ".")).join(" — ")}</p>}
      </Link>)}</div>
    </section>}
  </div>;
}
