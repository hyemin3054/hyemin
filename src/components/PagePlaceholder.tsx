import Link from "next/link";
import { Divider } from "./Divider";

type Props = { title: string; description: string; link?: { href: string; label: string } };

export function PagePlaceholder({ title, description, link }: Props) {
  return (
    <section className="container page-placeholder">
      <h1>{title}</h1>
      <Divider />
      <div className="stack">
        <p>{description}</p>
        <p className="muted">페이지 준비 중입니다.</p>
        {link && <Link href={link.href}>{link.label}</Link>}
      </div>
    </section>
  );
}
