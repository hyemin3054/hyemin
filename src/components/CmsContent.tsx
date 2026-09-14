import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentDetail, getContentList } from "@/sanity/lib/content";
import type { ContentType } from "@/sanity/lib/types";
import { Divider } from "./Divider";
import { ContentBody, ContentCard } from "./CmsFields";
export { CmsImage } from "./CmsFields";

export async function CmsList({ type, title, basePath }: { type: ContentType; title: string; basePath: string }) {
  const result = await getContentList(type);
  return <section className="container page-placeholder"><h1>{title}</h1><Divider />
    {result.status === "error" ? <p>콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p>
      : result.data.length ? <ul className="stack">{result.data.map((item) => <ContentCard item={item} basePath={basePath} key={item._id} />)}</ul> : <p>등록된 콘텐츠가 없습니다.</p>}
  </section>;
}

export async function CmsDetail({ type, slug, basePath }: { type: ContentType; slug: string; basePath: string }) {
  const result = await getContentDetail(type, slug);
  if (result.status !== "ready") return <section className="container page-placeholder"><h1>콘텐츠 준비 중</h1><p>{result.status === "error" ? "콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요." : "아직 콘텐츠가 연결되지 않았습니다."}</p><Link href={basePath}>목록으로</Link></section>;
  if (!result.data) notFound();
  return <article className="container page-placeholder stack card-copy"><Link href={basePath}>목록으로</Link><h1>{result.data.title}</h1><ContentBody item={result.data} /></article>;
}
