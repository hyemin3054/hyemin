import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata = { title: "Artists" };
export default function Page() {
  return <PagePlaceholder title="Artists" description="작가 목록" link={{ href: "/artists/preview", label: "상세 페이지 미리보기" }} />;
}
