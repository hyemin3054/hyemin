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
        <section><h2>Grotto Art Window</h2><address>
          {settings?.address && <p className="preserve-lines">{settings.address}</p>}
          {settings?.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
          {settings?.telephone && <a href={`tel:${settings.telephone.replace(/[^+\d]/g, "")}`}>{settings.telephone}</a>}
        </address></section>
        <section><h2>Visiting Hours</h2>
          <div className="footer-hours-group"><h3>Window Exhibition</h3><p>24 Hours · Everyday</p>
            <p className="footer-hours-note">Grotto Art Window의 윈도우 전시는 24시간 외부에서 관람하실 수 있으며,<br />언제든지 작품을 만나보실 수 있습니다.</p>
          </div>
          <div className="footer-hours-group"><h3>Gallery Hours</h3><p>10:00 — 20:00<br />Open Daily / 연중무휴</p></div>
        </section>
        {settings?.instagram && /^https?:\/\//i.test(settings.instagram) && <section><h2>Social</h2><a href={settings.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a></section>}
      </div></div>
      <div className="footer-bottom"><div className="container footer-bottom-content">
        <small>{settings?.copyright || `© ${new Date().getFullYear()} ${name}`}</small><BackToTop />
      </div></div>
    </footer>
  );
}
