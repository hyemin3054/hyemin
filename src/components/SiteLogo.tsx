"use client";
import Link from "next/link";
import { site } from "@/config/site";

export function SiteLogo({ src: _src, variant = "header" }: { src: string | null; variant?: "home" | "header" | "footer" }) {
  const logoSrc = variant === "home" ? site.homeLogo : site.logo;
  return <Link className={`site-logo site-logo--${variant}`} href={variant === "footer" ? "/" : "/#home-top"} aria-label={`${site.name} 홈`} onClick={event => {
    if (variant === "footer" || window.location.pathname !== "/" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.replaceState(window.history.state, "", "/#home-top");
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }}>
    {variant === "header" ? <span className="site-logo-pair" aria-hidden="true">
      <img src={site.homeLogo} alt="" />
      <img src={site.wordmarkLogo} alt="" />
    </span> : <img src={logoSrc} alt="" />}
  </Link>;
}
