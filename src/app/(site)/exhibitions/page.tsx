import { CmsList } from "@/components/CmsContent";

export const metadata = { title: "Exhibitions" };
export default function Page() {
  return <CmsList type="exhibition" title="Exhibitions" basePath="/exhibitions" />;
}
