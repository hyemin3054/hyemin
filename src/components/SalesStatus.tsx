import type { ContentDocument } from "@/sanity/lib/types";

export function SalesStatus({ value }: { value: ContentDocument["availability"] }) {
  if (!value || !["available", "reserved", "sold"].includes(value)) return null;
  return <span className={`sales-status sales-status--${value}`}><span aria-hidden="true" />{{ available: "Available", reserved: "Reserved", sold: "Sold" }[value]}</span>;
}
