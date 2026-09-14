import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata = { title: "News" };
export default function Page() {
  return <PagePlaceholder title="News" description="뉴스 목록" link={{ href: "/news/preview", label: "상세 페이지 미리보기" }} />;
}
