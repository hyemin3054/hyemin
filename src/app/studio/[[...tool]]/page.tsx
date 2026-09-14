import Studio from "./Studio";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) return <main><h1>Sanity 프로젝트 설정 대기</h1><p>Sanity에 로그인하여 프로젝트를 만든 뒤 Project ID와 dataset을 연결해야 합니다.</p><p>설정 방법은 프로젝트의 docs/SANITY.md를 확인해주세요.</p><a href="https://www.sanity.io/manage">Sanity 관리 페이지 열기</a></main>;
  return <Studio />;
}
