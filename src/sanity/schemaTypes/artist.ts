import { defineArrayMember, defineField, defineType } from "sanity";
import { titleField, slugField, imageField, textField, richTextField, historyField, featuredField, orderField, displayOrder } from "./shared";

export const artist = defineType({
  name: "artist", title: "작가", type: "document",
  fields: [
    titleField("name", "작가명"), slugField("name"), imageField("portrait", "작가 프로필 사진"), { ...imageField("representativeImage", "목록 대표 이미지"), description: "ARTISTS 목록에서 작가 이름을 선택하거나 마우스를 올렸을 때 표시할 이미지입니다. 실제 디자인 구현 시 적용됩니다." },
    textField("shortBio", "짧은 작가 소개"), richTextField("fullBio", "상세 작가 소개"),
    defineField({ name: "works", title: "작품 목록", type: "array", of: [defineArrayMember({ type: "artistWork" })], options: { sortable: true }, description: "작품별로 사진과 정보를 등록하세요. 드래그로 순서를 바꿀 수 있습니다." }),
    historyField("selectedExhibitions", "주요 전시 이력"), historyField("education", "학력"), historyField("awards", "수상"), orderField, featuredField,
  ],
  orderings: [displayOrder], preview: { select: { title: "name", media: "portrait" } },
});
