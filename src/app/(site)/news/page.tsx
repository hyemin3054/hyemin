import Link from "next/link";
import { Divider } from "@/components/Divider";
import { NewsImage } from "@/components/NewsImage";
import { getContentList } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";
import "@/styles/news.css";

export const metadata = { title: "News" };
export default async function Page() {
  const result = await getContentList("news");
  const items = [...result.data].sort((a, b) => (b.date || "").localeCompare(a.date || "") || a._id.localeCompare(b._id));
  return <section className="container news-page news-list-page"><h1>News</h1><Divider />
    {result.status !== "ready" ? <p>콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p> : !items.length ? <p>등록된 소식이 없습니다.</p> : <ul className="news-list">
      {items.map((item) => <li key={item._id}><Link className="news-list-item" href={`/news/${encodeURIComponent(item.slug)}`}>
        <div className="news-list-image"><NewsImage src={imageUrl(item.mainImage, 900)} alt={item.title} /></div>
        <div className="news-list-copy">{item.date && <time dateTime={item.date}>{item.date.replaceAll("-", ".")}</time>}<h2>{item.title}</h2>{item.excerpt?.trim() && <p className="preserve-lines">{item.excerpt}</p>}</div>
      </Link></li>)}
    </ul>}
  </section>;
}
