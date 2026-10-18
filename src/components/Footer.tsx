import { site } from "@/config/site";
import { getSiteSettings } from "@/sanity/lib/content";
import { BackToTop } from "./BackToTop";
import "@/styles/footer.css";

export async function Footer() {
  const { data: settings } = await getSiteSettings();
  const name = site.name;
  return (
    <footer className="site-footer gallery-footer">
      <div className="footer-information"><div className="container footer-information-grid">
        <section><h2>Gallery</h2><address>
          {settings?.address && <p className="preserve-lines">{settings.address}</p>}
          {settings?.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
          {settings?.telephone && <a href={`tel:${settings.telephone.replace(/[^+\d]/g, "")}`}>{settings.telephone}</a>}
        </address></section>
        <section><h2>Opening Hours</h2><p>Window Open: 24 Hours<br />10:00 — 20:00<br />Open Daily / 연중무휴</p></section>
        {settings?.instagram && /^https?:\/\//i.test(settings.instagram) && <section><h2>Social</h2><a href={settings.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a></section>}
      </div></div>
      <div className="footer-bottom"><div className="container footer-bottom-content">
        <small>{settings?.copyright || `© ${new Date().getFullYear()} ${name}`}</small><BackToTop />
      </div></div>
    </footer>
  );
}
