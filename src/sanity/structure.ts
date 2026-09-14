import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) => S.list().id("grotto-content").title("갤러리 콘텐츠").items([
  S.documentTypeListItem("artist").title("작가"),
  S.documentTypeListItem("exhibition").title("전시"),
  S.documentTypeListItem("news").title("소식"),
  S.documentTypeListItem("salesArtwork").title("판매 작품"),
  S.divider(),
  S.listItem().id("siteSettings").title("사이트 전체 설정").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
]);
