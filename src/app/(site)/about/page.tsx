import { PortableText } from "next-sanity";
import { getSiteSettings } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";
import { ContentVisual } from "@/components/ContentVisual";
import { site } from "@/config/site";
import "@/styles/about.css";

function AboutLogo() {
  return <div className="about-logo"><img src={site.logo} alt="The Grotto Art Window" /></div>;
}
export const metadata = { title: "About" };
export default async function AboutPage() {
  const { data: settings, status } = await getSiteSettings();
  const images = (settings?.aboutImages || []).filter((image) => imageUrl(image));
  const map = settings?.mapInformation;
  const location = map?.location;
  const coordinateUrl = location && Number.isFinite(location.lat) && Number.isFinite(location.lng)
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.lat},${location.lng}`)}` : null;
  const mapQuery = coordinateUrl ? `${location!.lat},${location!.lng}` : settings?.address?.trim();
  const mapUrl = map?.mapUrl && /^https?:\/\//i.test(map.mapUrl) ? map.mapUrl : coordinateUrl || (mapQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : null);
  const embedUrl = mapQuery ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed` : null;
  const hasContact = settings && (settings.address || settings.telephone || settings.email || settings.instagram || map?.directions || mapUrl);
  return <article className="container about-page"><h1>ABOUT</h1>
    {status !== "ready" && <p>콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p>}
    {status === "ready" && !settings && <p>갤러리 정보를 준비 중입니다.</p>}
    {images[0] && <div className="about-panorama"><ContentVisual src={imageUrl(images[0], 1800)} alt="갤러리 공간" /></div>}
    <div className="about-brand">
      <AboutLogo />
      <p className="about-tagline">“ 예술과 일상이 마주하는 작은 창 ”</p>
    </div>
    {settings && (settings.aboutText?.length || settings.openingHours) && <section className="about-introduction" aria-label="갤러리 소개">
      {Array.isArray(settings.aboutText) && settings.aboutText.length > 0 && <div className="about-prose"><PortableText value={settings.aboutText} /></div>}
      {settings.openingHours && <p className="about-hours preserve-lines">{settings.openingHours}</p>}
    </section>}
    {images.length > 1 && <section className="about-space" aria-labelledby="space-title"><h2 id="space-title">SPACE</h2>
      <div className="about-space-grid">{images.slice(1).map((image, i) => <figure key={image._key || i}><ContentVisual src={imageUrl(image, 900)} alt={`갤러리 공간 ${i + 2}`} /></figure>)}</div>
    </section>}
    {hasContact && <section id="contact" className="about-contact" aria-labelledby="contact-title"><h2 id="contact-title">CONTACT</h2>
      <div className="about-contact-grid"><div className="about-contact-copy">
        <section className="about-contact-information" aria-labelledby="contact-information-title"><h3 id="contact-information-title">Contact Information</h3><address>
          {settings.telephone && <a href={`tel:${settings.telephone.replace(/[^+\d]/g, "")}`}>{settings.telephone}</a>}
          {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
          {settings.instagram && /^https?:\/\//i.test(settings.instagram) && <a href={settings.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
        </address></section>
        <section className="about-location-copy" aria-labelledby="location-title"><h3 id="location-title">Location</h3>
          {settings.address && <p className="preserve-lines">{settings.address}</p>}
          {map?.directions?.trim() && <p className="preserve-lines">{map.directions}</p>}
        </section>
      </div>
      {mapUrl && <div className="about-map">{embedUrl && <iframe title="The Grotto Art Window 위치" src={embedUrl} loading="eager" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />}<a href={mapUrl} target="_blank" rel="noopener noreferrer">Google Maps에서 위치 보기</a></div>}
      </div>
    </section>}
  </article>;
}
