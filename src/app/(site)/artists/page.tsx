import { CmsList } from "@/components/CmsContent";

export const metadata = { title: "Artists" };
export default function Page() {
  return <CmsList type="artist" title="Artists" basePath="/artists" />;
}
