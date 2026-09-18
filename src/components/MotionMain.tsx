"use client";

import { ViewTransition, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function MotionMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <ViewTransition key={pathname} name="page-content" share="page-fade" enter="page-fade" exit="page-fade" default="none">
    <main id="main-content" className="site-main" tabIndex={-1}>{children}</main>
  </ViewTransition>;
}
