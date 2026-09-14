import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata = { title: "Available Works" };
export default function Page() {
  return <PagePlaceholder title="Available Works" description="작품과 가격을 안내합니다. 구매는 Contact를 통한 직접 문의로 진행합니다." link={{ href: "/sales/preview", label: "상세 페이지 미리보기" }} />;
}
