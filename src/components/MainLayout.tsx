import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">본문 바로가기</a>
      <Header />
      <main id="main-content" className="site-main" tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  );
}
