import type { ReactNode } from "react";

export function PageHeading({ children, as = "h1", id, section = false }: { children: ReactNode; as?: "h1" | "h2"; id?: string; section?: boolean }) {
  const Heading = as;
  return <Heading id={id} className={`page-heading${section ? " page-heading--section" : ""}`}>{children}</Heading>;
}
