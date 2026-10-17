import { PortableText, type PortableTextBlock } from "next-sanity";
import { getSiteSettings } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";
import { AboutImageSlider } from "@/components/AboutImageSlider";
import { Divider } from "@/components/Divider";
import { PageHeading } from "@/components/PageHeading";
import { site } from "@/config/site";
import "@/styles/about.css";

function AboutLogo() {
  return <div className="about-logo"><img src={site.logo} alt="The Grotto Art Window" /></div>;
}
const OPENING_HOURS = "Window 개방: 24시간\n운영시간: 오전 10시 ~ 오후 8시\n연중무휴";
const BRAND_STATEMENT = "예술과 일상이 마주하는 작은 창";
const INTRO_PHRASE = "도시 속에서 만나는 작은 동굴, 그 안의 세계를 들여다보다";
function blockText(block: unknown) {
  const children = (block as { children?: Array<{ text?: string }> })?.children || [];
  return children.map(child => child.text || "").join("").replace(/\s+/g, " ").trim();
}
function moveIntroStatement(blocks: PortableTextBlock[]): PortableTextBlock[] {
  return blocks.map(block => ({
    ...block,
    children: block.children?.map(child => "text" in child && typeof child.text === "string" ? ({
        ...child,
        text: child.text
          .replace("도시 속에서 만나는 작은 동굴", "")
          .replace("그 안의 세계를 들여다보다.", "")
          .replace("그 안의 세계를 들여다보다", ""),
      }) : child),
  })).filter(block => blockText(block));
}
export const metadata = { title: "About" };
export default async function AboutPage() {
  const { data: settings, status } = await getSiteSettings();
  const images = (settings?.aboutImages || []).filter((image) => imageUrl(image));
  const aboutSlides = images.map((image, index) => ({ src: imageUrl(image, 1600)!, alt: `The Grotto Art Window 소개 이미지 ${index + 1}` }));
  const map = settings?.mapInformation;
  const location = map?.location;
  const coordinateUrl = location && Number.isFinite(location.lat) && Number.isFinite(location.lng)
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.lat},${location.lng}`)}` : null;
  const mapQuery = coordinateUrl ? `${location!.lat},${location!.lng}` : settings?.address?.trim();
  const mapUrl = map?.mapUrl && /^https?:\/\//i.test(map.mapUrl) ? map.mapUrl : coordinateUrl || (mapQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : null);
  const embedUrl = mapQuery ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed` : null;
  const aboutText = Array.isArray(settings?.aboutText) ? settings.aboutText : [];
  const aboutBody = moveIntroStatement(aboutText);
  const hasContact = settings && (settings.address || settings.telephone || settings.email || settings.instagram || map?.directions || mapUrl || OPENING_HOURS);
  return <article className="container about-page"><PageHeading>ABOUT</PageHeading><Divider />
    {status !== "ready" && <p>콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p>}
    {status === "ready" && !settings && <p>갤러리 정보를 준비 중입니다.</p>}
    <div className="about-brand">
      <AboutLogo />
      <p className="about-brand-statement">“ {BRAND_STATEMENT} ”</p>
      <p className="about-tagline">{INTRO_PHRASE}</p>
    </div>
    <AboutImageSlider images={aboutSlides} />
    {settings && aboutBody.length > 0 && <section className="about-introduction" aria-label="갤러리 소개">
      <div className="about-prose"><PortableText value={aboutBody} /></div>
    </section>}
    {hasContact && <section id="contact" className="about-contact" aria-labelledby="contact-title">
      <div className="about-contact-grid"><div className="about-contact-copy"><h2 id="contact-title">CONTACT</h2>
        <section className="about-contact-information" aria-labelledby="contact-information-title"><h3 id="contact-information-title">Contact Information</h3><address>
          {settings.telephone && <a href={`tel:${settings.telephone.replace(/[^+\d]/g, "")}`}>{settings.telephone}</a>}
          {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
          {settings.instagram && /^https?:\/\//i.test(settings.instagram) && <a href={settings.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
        </address></section>
        <section className="about-location-copy" aria-labelledby="location-title"><h3 id="location-title">Location</h3>
          {settings.address && <p className="preserve-lines">{settings.address}</p>}
          {map?.directions?.trim() && <p className="preserve-lines">{map.directions}</p>}
          <div className="about-opening-hours"><h3>Opening Hours</h3><p className="preserve-lines">{OPENING_HOURS}</p></div>
        </section>
      </div>
      {mapUrl && <div className="about-map">{embedUrl && <iframe title="The Grotto Art Window 위치" src={embedUrl} loading="eager" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />}<a href={mapUrl} target="_blank" rel="noopener noreferrer">Google Maps에서 위치 보기</a></div>}
      </div>
    </section>}
  </article>;
}
