import { PagePlaceholder } from "@/components/PagePlaceholder";

type Props = { params: Promise<{ slug: string }> };
export const metadata = { title: "전시 상세" };
export default async function DetailPage({ params }: Props) {
  const { slug } = await params;
  return <PagePlaceholder title="Exhibitions Detail" description={`전시 상세 · ${slug}`} link={{ href: "/exhibitions", label: "목록으로" }} />;
}
