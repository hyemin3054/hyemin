import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata = { title: "Exhibitions" };
export default function Page() {
  return <PagePlaceholder title="Exhibitions" description="전시 목록" link={{ href: "/exhibitions/preview", label: "상세 페이지 미리보기" }} />;
}
