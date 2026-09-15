import { site } from "@/config/site";
import { getSiteSettings } from "@/sanity/lib/content";
import { Divider } from "./Divider";
import { imageUrl } from "@/sanity/lib/image";
import { SiteLogo } from "./SiteLogo";

export async function Footer() {
  const { data: settings } = await getSiteSettings();
  const name = site.name;
  const contact = { address: settings?.address, hours: settings?.openingHours, phone: settings?.telephone, email: settings?.email, instagramUrl: settings?.instagram };
  return (
    <footer className="site-footer container">
      <Divider />
      <div className="footer-grid">
        <div className="footer-brand">
          <SiteLogo src={imageUrl(settings?.logo, 800)} variant="footer" />
          <small className="footer-copyright">{settings?.copyright || `© ${new Date().getFullYear()} ${name}`}</small>
        </div>
        <div className="footer-location">
          {contact.address && <p className="preserve-lines">{contact.address}</p>}
          {contact.hours && <p className="preserve-lines">{contact.hours}</p>}
          {contact.phone && <p>T. {contact.phone}</p>}
        </div>
        <address className="footer-contact">
          {contact.email && <a href={`mailto:${contact.email}`}>E. {contact.email}</a>}
          {contact.instagramUrl && /^https:\/\//i.test(contact.instagramUrl) && <a href={contact.instagramUrl}>Instagram</a>}
        </address>
      </div>
    </footer>
  );
}
