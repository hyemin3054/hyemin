"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";
import { SiteLogo } from "./SiteLogo";

export function HeaderLayout({ logoUrl }: { logoUrl: string | null }) {
  const home = usePathname() === "/";
  return <header className={`site-header site-header--${home ? "home" : "inner"}`}>
    <div className="container header-content">
      <SiteLogo src={logoUrl} variant={home ? "home" : "header"} />
      <Navigation />
    </div>
  </header>;
}
