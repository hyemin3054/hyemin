"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";
import { SiteLogo } from "./SiteLogo";

export function HeaderLayout({ logoUrl }: { logoUrl: string | null }) {
  const pathname = usePathname();
  const home = pathname === "/";
  const salesList = pathname === "/sales";
  return <header className={`site-header site-header--${home ? "home" : "inner"}${salesList ? " site-header--sales-list" : ""}`}>
    <div className="container header-content">
      <SiteLogo src={logoUrl} variant={home ? "home" : "header"} />
      <Navigation />
    </div>
  </header>;
}
