"use client";
import Link from "next/link";
import { site } from "@/config/site";

export function SiteLogo({ src, variant = "header" }: { src: string | null; variant?: "home" | "header" | "footer" }) {
  return <Link className={`site-logo site-logo--${variant}`} href={variant === "footer" ? "/" : "/#home-top"} aria-label={`${site.name} 홈`} onClick={event => {
    if (variant === "footer" || window.location.pathname !== "/" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.replaceState(window.history.state, "", "/#home-top");
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }}>
    {src ? <img src={src} alt="" /> : <span className="logo-fallback">{site.name}</span>}
  </Link>;
}
