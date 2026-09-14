import { PagePlaceholder } from "@/components/PagePlaceholder";

type Props = { params: Promise<{ slug: string }> };
export const metadata = { title: "작가 상세" };
export default async function DetailPage({ params }: Props) {
  const { slug } = await params;
  return <PagePlaceholder title="Artists Detail" description={`작가 상세 · ${slug}`} link={{ href: "/artists", label: "목록으로" }} />;
}
