import { CmsDetail } from "@/components/CmsContent";

type Props = { params: Promise<{ slug: string }> };
export const metadata = { title: "Available Works" };
export default async function DetailPage({ params }: Props) {
  const { slug } = await params;
  return <CmsDetail type="salesArtwork" slug={slug} basePath="/sales" />;
}
