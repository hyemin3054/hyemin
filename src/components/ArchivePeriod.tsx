export function ArchivePeriod({ start, end }: { start?: string | null; end?: string | null }) {
  if (!start && !end) return null;
  return <p className="archive-period">{start && <time dateTime={start}>{start.replaceAll("-", ".")}</time>}{start && end && " — "}{end && <time dateTime={end}>{end.replaceAll("-", ".")}</time>}</p>;
}
