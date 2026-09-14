import { PagePlaceholder } from "@/components/PagePlaceholder";

export default function NotFound() {
  return <PagePlaceholder title="페이지를 찾을 수 없습니다" description="주소를 다시 확인해주세요." link={{ href: "/", label: "홈으로" }} />;
}
