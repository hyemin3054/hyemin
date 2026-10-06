"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { site } from "@/config/site";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <nav aria-label="주 메뉴">
      <ul className="navigation">
        {site.navigation.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} scroll={href === "/#archive" ? false : undefined} onClick={event => {
              if (href !== "/#archive" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              if (pathname === "/") {
                window.history.pushState(window.history.state, "", "/#archive");
                document.getElementById("archive")?.scrollIntoView({ block: "start", behavior: "smooth" });
              } else {
                router.push("/#archive", { scroll: false });
              }
            }} aria-current={pathname === href ? "page" : pathname.startsWith(`${href}/`) ? "location" : undefined}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
