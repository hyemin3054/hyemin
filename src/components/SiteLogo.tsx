import Link from "next/link";
import { site } from "@/config/site";

export function SiteLogo({ src, variant = "header" }: { src: string | null; variant?: "home" | "header" | "footer" }) {
  return <Link className={`site-logo site-logo--${variant}`} href="/" aria-label={`${site.name} 홈`}>
    {src ? <img src={src} alt="" /> : <span className="logo-fallback">{site.name}</span>}
  </Link>;
}
