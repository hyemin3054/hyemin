import Link from "next/link";
import { Navigation } from "./Navigation";
import { site } from "@/config/site";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <Link className="site-name" href="/">{site.name}</Link>
        <Navigation />
      </div>
    </header>
  );
}
