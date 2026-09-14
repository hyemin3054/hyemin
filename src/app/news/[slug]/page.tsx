import { PagePlaceholder } from "@/components/PagePlaceholder";

type Props = { params: Promise<{ slug: string }> };
export const metadata = { title: "뉴스 상세" };
export default async function DetailPage({ params }: Props) {
  const { slug } = await params;
  return <PagePlaceholder title="News Detail" description={`뉴스 상세 · ${slug}`} link={{ href: "/news", label: "목록으로" }} />;
}
