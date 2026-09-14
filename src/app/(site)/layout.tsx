import type { ReactNode } from "react";
import { MainLayout } from "@/components/MainLayout";
import "@/styles/globals.css";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
