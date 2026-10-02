import type { SiteSettings } from "@/sanity/lib/types";

export function PurchaseContact({ settings }: { settings: SiteSettings | null }) {
  const instagram = settings?.instagram?.trim();
  const email = settings?.email?.trim();
  const phone = settings?.telephone?.replace(/[^+\d]/g, "");
  const links = [
    { label: "Phone", href: phone && /\d/.test(phone) ? `tel:${phone}` : null },
    { label: "Email", href: email ? `mailto:${email}` : null },
    { label: "Instagram", href: instagram && /^https:\/\//i.test(instagram) ? instagram : null },
  ];
  return <section className="sales-purchase-contact" aria-label="구매 문의">
    <h2>CONTACT</h2>
    <address>{links.map(link => link.href ? <a key={link.label} href={link.href}>{link.label}</a> : <span key={link.label} className="muted">{link.label} · 등록 예정</span>)}</address>
  </section>;
}

export function SalesPageHeader({ settings, detail = false }: { settings: SiteSettings | null; detail?: boolean }) {
  return <header className="sales-page-heading">
    <div>{detail ? <p className="sales-eyebrow">SALES</p> : <h1 className="sales-works-heading">SALES</h1>}</div>
    {!detail && <PurchaseContact settings={settings} />}
  </header>;
}
