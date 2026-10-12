import { site } from "@/config/site";
import { getSiteSettings } from "@/sanity/lib/content";
import { Divider } from "./Divider";
import { imageUrl } from "@/sanity/lib/image";
import { SiteLogo } from "./SiteLogo";

export async function Footer() {
  const { data: settings } = await getSiteSettings();
  const name = site.name;
  return (
    <footer className="site-footer container">
      <Divider />
      <div className="footer-grid">
        <div className="footer-brand">
          <SiteLogo src={imageUrl(settings?.logo, 800)} variant="footer" />
          <small className="footer-copyright">{settings?.copyright || `© ${new Date().getFullYear()} ${name}`}</small>
        </div>
      </div>
    </footer>
  );
}
