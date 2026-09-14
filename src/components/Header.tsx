import Link from "next/link";
import { Navigation } from "./Navigation";
import { site } from "@/config/site";
import { getSiteSettings } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";

export async function Header() {
  const { data: settings } = await getSiteSettings();
  const logoUrl = imageUrl(settings?.logo, 240);
  return (
    <header className="site-header">
      <div className="container header-content">
        <Link className="site-name" href="/" aria-label={site.name}>{logoUrl && <img src={logoUrl} alt="" />}{!logoUrl && "홈"}</Link>
        <Navigation />
      </div>
    </header>
  );
}
