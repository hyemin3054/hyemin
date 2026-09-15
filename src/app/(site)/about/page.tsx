import { PortableText } from "next-sanity";
import { getSiteSettings } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";
import { ContentVisual } from "@/components/ContentVisual";
import "@/styles/about.css";

function AboutLogo({ src }: { src: string }) {
  return <div className="about-logo" role="img" aria-label="The Grotto Art Window">
    <span className="about-logo-symbol"><img src={src} alt="" /></span>
    <span className="about-logo-wordmark"><img src={src} alt="" /></span>
  </div>;
}
export const metadata = { title: "About" };
export default async function AboutPage() {
  const { data: settings, status } = await getSiteSettings();
  const images = (settings?.aboutImages || []).filter((image) => imageUrl(image));
  const logo = imageUrl(settings?.logo, 900);
  const map = settings?.mapInformation;
  const location = map?.location;
  const coordinateUrl = location && Number.isFinite(location.lat) && Number.isFinite(location.lng)
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.lat},${location.lng}`)}` : null;
  const mapUrl = map?.mapUrl && /^https?:\/\//i.test(map.mapUrl) ? map.mapUrl : coordinateUrl;
  const hasContact = settings && (settings.address || settings.telephone || settings.email || settings.instagram || map?.directions || mapUrl);
  return <article className="container about-page"><h1>ABOUT</h1>
    {status !== "ready" && <p>콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p>}
    {status === "ready" && !settings && <p>갤러리 정보를 준비 중입니다.</p>}
    {images[0] && <div className="about-panorama"><ContentVisual src={imageUrl(images[0], 1800)} alt="갤러리 공간" /></div>}
    {logo && <div className="about-brand"><AboutLogo src={logo} /></div>}
    {settings && (settings.aboutText?.length || settings.openingHours) && <section className="about-introduction" aria-label="갤러리 소개">
      {Array.isArray(settings.aboutText) && settings.aboutText.length > 0 && <div className="about-prose"><PortableText value={settings.aboutText} /></div>}
      {settings.openingHours && <p className="about-hours preserve-lines">{settings.openingHours}</p>}
    </section>}
    {images.length > 1 && <section className="about-space" aria-labelledby="space-title"><h2 id="space-title">SPACE</h2>
      <div className="about-space-grid">{images.slice(1).map((image, i) => <figure key={image._key || i}><ContentVisual src={imageUrl(image, 900)} alt={`갤러리 공간 ${i + 2}`} /></figure>)}</div>
    </section>}
    {hasContact && <section id="contact" className="about-contact" aria-labelledby="contact-title"><h2 id="contact-title">CONTACT</h2>
      <div className="about-contact-grid"><div className="about-contact-copy">
        {logo && <AboutLogo src={logo} />}
        {settings.address && <p className="preserve-lines">{settings.address}</p>}
        {map?.directions?.trim() && <p className="preserve-lines">{map.directions}</p>}
        <address>
          {settings.telephone && <a href={`tel:${settings.telephone.replace(/[^+\d]/g, "")}`}>{settings.telephone}</a>}
          {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
          {settings.instagram && /^https?:\/\//i.test(settings.instagram) && <a href={settings.instagram}>Instagram</a>}
        </address>
      </div>
      {mapUrl && <div className="about-location"><a href={mapUrl}>지도 보기{settings.address && <span>{settings.address}</span>}</a></div>}
      </div>
    </section>}
  </article>;
}
