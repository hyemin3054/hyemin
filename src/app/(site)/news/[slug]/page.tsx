import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { Divider } from "@/components/Divider";
import { NewsImage } from "@/components/NewsImage";
import { NewsGallery } from "@/components/NewsGallery";
import { getContentDetail, getContentList } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";
import "@/styles/news.css";

type Props = { params: Promise<{ slug: string }> };
export const metadata = { title: "News" };
export default async function DetailPage({ params }: Props) {
  const { slug } = await params;
  const [result, list] = await Promise.all([getContentDetail("news", slug), getContentList("news")]);
  if (result.status !== "ready") return <section className="container news-page"><p>콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p></section>;
  const item = result.data;
  if (!item) notFound();
  const sorted = [...list.data].sort((a, b) => (b.date || "").localeCompare(a.date || "") || a._id.localeCompare(b._id));
  const others = sorted.filter((entry) => entry._id !== item._id).slice(0, 3);
  const images = [item.mainImage, ...(item.detailImages || []).slice(0, 5)].map(image => imageUrl(image, 1200)).filter((url): url is string => Boolean(url));
  return <article className="container news-page news-detail-page">
    <p className="news-section-title">News</p>
    <header className="news-article-heading"><h1>{item.title}</h1>{item.date && <time dateTime={item.date}>{item.date.replaceAll("-", ".")}</time>}</header><Divider />
    <div className="news-article-content">
      {Array.isArray(item.body) && item.body.length > 0 && <div className="news-body"><PortableText value={item.body} /></div>}
      <NewsGallery key={item._id} images={images} title={item.title} />
    </div>
    {others.length > 0 && <nav className="news-related" aria-label="다른 소식">{[item, ...others].map((entry) => <Link key={entry._id} href={`/news/${encodeURIComponent(entry.slug)}`} aria-current={entry._id === item._id ? "page" : undefined}>
      <div className="news-related-image"><NewsImage src={imageUrl(entry.mainImage, 500)} alt={entry.title} /></div><p>{entry.title}</p>
    </Link>)}</nav>}
  </article>;
}
