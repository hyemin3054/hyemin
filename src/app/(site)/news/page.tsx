import { CmsList } from "@/components/CmsContent";

export const metadata = { title: "News" };
export default function Page() {
  return <CmsList type="news" title="News" basePath="/news" />;
}
