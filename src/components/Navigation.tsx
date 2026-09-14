"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";

export function Navigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="주 메뉴">
      <ul className="navigation">
        {site.navigation.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} aria-current={pathname === href ? "page" : pathname.startsWith(`${href}/`) ? "location" : undefined}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
