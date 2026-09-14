import { CmsList } from "@/components/CmsContent";

export const metadata = { title: "Available Works" };
export default function Page() {
  return <CmsList type="salesArtwork" title="Available Works" basePath="/sales" />;
}
