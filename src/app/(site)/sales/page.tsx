import { getContentList } from "@/sanity/lib/content";
import { SalesGrid, sortArtworks } from "@/components/SalesGrid";
import { Divider } from "@/components/Divider";
import "@/styles/sales.css";

export const metadata = { title: "Available Works" };
export default async function Page() {
  const result = await getContentList("salesArtwork");
  return <section className="container sales-page"><p className="sales-eyebrow">SALES</p><h1>Available Works</h1><Divider />
    {result.status !== "ready" ? <p className="sales-empty">콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p> : result.data.length ? <SalesGrid items={sortArtworks(result.data)} /> : <p className="sales-empty">등록된 작품이 없습니다.</p>}
  </section>;
}
