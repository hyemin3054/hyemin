import { CmsDetail } from "@/components/CmsContent";

type Props = { params: Promise<{ slug: string }> };
export const metadata = { title: "Artists" };
export default async function DetailPage({ params }: Props) {
  const { slug } = await params;
  return <CmsDetail type="artist" slug={slug} basePath="/artists" />;
}
