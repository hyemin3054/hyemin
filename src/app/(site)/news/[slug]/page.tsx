import { CmsDetail } from "@/components/CmsContent";

type Props = { params: Promise<{ slug: string }> };
export const metadata = { title: "News" };
export default async function DetailPage({ params }: Props) {
  const { slug } = await params;
  return <CmsDetail type="news" slug={slug} basePath="/news" />;
}
