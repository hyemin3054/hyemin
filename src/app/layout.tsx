import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.name}` },
  description: "The Grotto Art Window 갤러리 웹사이트",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}
