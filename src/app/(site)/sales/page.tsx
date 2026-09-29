import { SalesPageHeader, PurchaseContact } from "@/components/SalesPageHeader";
import { getContentList, getSiteSettings } from "@/sanity/lib/content";
import { SalesGrid, sortArtworks } from "@/components/SalesGrid";
import { Divider } from "@/components/Divider";
import "@/styles/sales.css";

export const metadata = { title: "Sales" };
export default async function Page() {
  const [result, settings] = await Promise.all([getContentList("salesArtwork"), getSiteSettings()]);
  return <section className="container sales-page"><SalesPageHeader settings={settings.data} /><Divider /><div className="sales-mobile-contact"><PurchaseContact settings={settings.data} /></div>
    {result.status !== "ready" ? <p className="sales-empty">콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p> : result.data.length ? <SalesGrid items={sortArtworks(result.data)} alignImageCopy /> : <p className="sales-empty">등록된 작품이 없습니다.</p>}
  </section>;
}
