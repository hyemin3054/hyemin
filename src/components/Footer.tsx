import { site } from "@/config/site";
import { Divider } from "./Divider";

export function Footer() {
  const contact = site.contact;
  return (
    <footer className="site-footer container">
      <Divider />
      <div className="footer-grid">
        <div className="stack-small">
          <p>{site.name}</p>
          <small>© {new Date().getFullYear()} {site.name}</small>
        </div>
        <div className="stack-small">
          {contact.address && <p>{contact.address}</p>}
          {contact.hours && <p>{contact.hours}</p>}
          {contact.phone && <p>{contact.phone}</p>}
        </div>
        <address className="stack-small">
          {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
          {contact.instagramUrl && <a href={contact.instagramUrl}>Instagram</a>}
        </address>
      </div>
    </footer>
  );
}
