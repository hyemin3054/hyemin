import { PortableText } from "next-sanity";
import { getSiteSettings } from "@/sanity/lib/content";
import { CmsImage } from "@/components/CmsContent";

export const metadata = { title: "About" };
export default async function AboutPage() {
  const { data: settings, status } = await getSiteSettings();
  const mapUrl = settings?.mapInformation?.mapUrl;
  const location = settings?.mapInformation?.location;
  return <section className="container page-placeholder stack"><h1>About</h1>
    {status === "error" && <p>콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p>}
    {!settings && status !== "error" && <p>갤러리 정보를 준비 중입니다.</p>}
    {Array.isArray(settings?.aboutText) && <PortableText value={settings.aboutText} />}
    {(settings?.aboutImages || []).filter(Boolean).map((image, index) => <CmsImage key={image._key || index} image={image} />)}
    {settings && <div id="contact" className="stack-small"><h2>Contact</h2>
      {settings.address && <p className="preserve-lines">{settings.address}</p>}
      {settings.openingHours && <p className="preserve-lines">{settings.openingHours}</p>}
      {settings.telephone && <p>{settings.telephone}</p>}
      {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
      {mapUrl && /^https?:\/\//i.test(mapUrl) && <a href={mapUrl}>지도 보기</a>}
      {location && Number.isFinite(location.lat) && Number.isFinite(location.lng) && <p>위도: {location.lat}, 경도: {location.lng}{location.alt != null && Number.isFinite(location.alt) && `, 고도: ${location.alt}m`}</p>}
      {settings.mapInformation?.directions && <p className="preserve-lines">{settings.mapInformation.directions}</p>}
    </div>}
  </section>;
}
