import { defineArrayMember, defineField, defineType } from "sanity";
import { titleField, slugField, imageField, textField, richTextField, historyField, orderField, displayOrder } from "./shared";

export const artist = defineType({
  name: "artist", title: "작가", type: "document",
  fields: [
    titleField("name", "작가명"), slugField("name"), imageField("portrait", "작가 프로필 사진"), { ...imageField("representativeImage", "목록 대표 이미지"), description: "ARTISTS 목록에서 작가 이름을 선택하거나 마우스를 올렸을 때 표시할 이미지입니다. 실제 디자인 구현 시 적용됩니다." },
    { ...textField("representativeImageDescription", "대표 작품 설명"), description: "작가 상세 페이지의 대표 작품 이미지 아래에 표시됩니다. 작품명, 제작 연도, 설명 등을 자유롭게 입력하세요. 비워두어도 됩니다." },
    textField("shortBio", "짧은 작가 소개"), richTextField("fullBio", "상세 작가 소개"),
    defineField({ name: "works", title: "작품 목록", type: "array", of: [defineArrayMember({ type: "artistWork" })], options: { sortable: true }, description: "작품별 이미지·제목·제작연도·설명을 입력하세요. 목록 대표 이미지와 같은 이미지를 선택한 작품은 대표 작품의 제목과 설명에도 연결됩니다. 드래그로 순서를 바꿀 수 있습니다." }),
    historyField("selectedExhibitions", "주요 전시 이력"), historyField("education", "학력"), historyField("awards", "수상"), orderField,
  ],
  orderings: [displayOrder], preview: { select: { title: "name", media: "portrait" } },
});
