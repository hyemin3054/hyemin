import { site } from "@/config/site";
import { getSiteSettings } from "@/sanity/lib/content";
import { Divider } from "./Divider";

export async function Footer() {
  const { data: settings } = await getSiteSettings();
  const name = site.name;
  const contact = { address: settings?.address, hours: settings?.openingHours, phone: settings?.telephone, email: settings?.email, instagramUrl: settings?.instagram };
  return (
    <footer className="site-footer container">
      <Divider />
      <div className="footer-grid">
        <div className="stack-small">
          <small>{settings?.copyright || `© ${new Date().getFullYear()} ${name}`}</small>
        </div>
        <div className="stack-small">
          {contact.address && <p className="preserve-lines">{contact.address}</p>}
          {contact.hours && <p className="preserve-lines">{contact.hours}</p>}
          {contact.phone && <p>{contact.phone}</p>}
        </div>
        <address className="stack-small">
          {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
          {contact.instagramUrl && /^https:\/\//i.test(contact.instagramUrl) && <a href={contact.instagramUrl}>Instagram</a>}
        </address>
      </div>
    </footer>
  );
}
