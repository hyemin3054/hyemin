import type { ReactNode } from "react";
export function MotionMain({ children }: { children: ReactNode }) {
  return <main id="main-content" className="site-main" tabIndex={-1}>{children}</main>;
}
