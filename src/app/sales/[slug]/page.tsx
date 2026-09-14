import { PagePlaceholder } from "@/components/PagePlaceholder";

type Props = { params: Promise<{ slug: string }> };
export const metadata = { title: "Artwork" };
export default async function DetailPage({ params }: Props) {
  const { slug } = await params;
  return <PagePlaceholder title="Artwork Detail" description={`작품의 가격과 설명을 안내할 공간입니다. 구매는 직접 문의로 진행합니다. · ${slug}`} link={{ href: "/sales", label: "목록으로" }} />;
}
