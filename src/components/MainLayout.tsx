import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SiteMotion } from "./SiteMotion";
import { MotionMain } from "./MotionMain";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <SiteMotion />
      <a className="skip-link" href="#main-content">본문 바로가기</a>
      <Header />
      <MotionMain>{children}</MotionMain>
      <Footer />
    </div>
  );
}
