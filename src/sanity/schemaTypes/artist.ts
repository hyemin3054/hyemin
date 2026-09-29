import { defineArrayMember, defineField, defineType } from "sanity";
import { titleField, slugField, imageField, textField, richTextField, historyField, galleryField, orderField, displayOrder } from "./shared";

export const artist = defineType({
  name: "artist", title: "작가", type: "document",
  fields: [
    titleField("name", "작가명"), slugField("name"), { ...imageField("portrait", "이전 프로필 이미지"), hidden: true, readOnly: true }, { ...imageField("representativeImage", "작가 대표 이미지"), description: "작가 목록과 상세 상단에서 공통으로 사용합니다. 비워두면 기존 포트폴리오 첫 이미지 → 이전 프로필 사진 → 작품 순서로 사용하여 기존 콘텐츠를 보존합니다." },
    { ...textField("representativeImageDescription", "대표 작품 설명"), description: "작가 상세 페이지의 대표 작품 이미지 아래에 표시됩니다. 작품명, 제작 연도, 설명 등을 자유롭게 입력하세요. 비워두어도 됩니다." },
    { ...galleryField("portfolioImages", "포트폴리오 이미지 모음"), description: "추가 작품 이미지 모음입니다. 드래그로 순서를 바꿀 수 있습니다. 대표 이미지가 비어 있는 기존 작가는 첫 이미지를 대표로 사용합니다." },
    textField("shortBio", "짧은 작가 소개"), richTextField("fullBio", "상세 작가 소개"),
    defineField({ name: "works", title: "작품 목록", type: "array", of: [defineArrayMember({ type: "artistWork" })], options: { sortable: true }, description: "작품별 이미지·제목·제작연도·설명을 입력하세요. 목록 대표 이미지와 같은 이미지를 선택한 작품은 대표 작품의 제목과 설명에도 연결됩니다. 드래그로 순서를 바꿀 수 있습니다." }),
    historyField("selectedExhibitions", "주요 전시 이력"), historyField("education", "학력"), historyField("awards", "수상"), orderField,
  ],
  orderings: [displayOrder], preview: { select: { title: "name", media: "representativeImage" } },
});
