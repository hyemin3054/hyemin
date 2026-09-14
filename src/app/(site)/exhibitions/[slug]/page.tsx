import { CmsDetail } from "@/components/CmsContent";

type Props = { params: Promise<{ slug: string }> };
export const metadata = { title: "Exhibitions" };
export default async function DetailPage({ params }: Props) {
  const { slug } = await params;
  return <CmsDetail type="exhibition" slug={slug} basePath="/exhibitions" />;
}
