import { defineField, defineType } from "sanity";
import { titleField, slugField, imageField, galleryField, textField, richTextField, artistField, orderField, displayOrder } from "./shared";

export const exhibition = defineType({
  name: "exhibition", title: "전시", type: "document",
  fields: [
    titleField(), slugField(), artistField,
    defineField({ name: "startDate", title: "시작일", type: "date" }),
    defineField({ name: "endDate", title: "종료일", type: "date", validation: (rule) => rule.custom((value, context) => !value || !context.document?.startDate || value >= String(context.document.startDate) ? true : "종료일은 시작일보다 빠를 수 없습니다.") }),
    imageField("mainImage", "대표 이미지"),
    { ...galleryField("galleryImages", "전시 이미지 갤러리"), description: "필요한 만큼 이미지를 등록하고 순서를 변경할 수 있습니다. 목록 화면에는 대표 이미지를 포함해 앞의 최대 4장만 표시되며, 상세 화면에는 전체 이미지가 표시됩니다." },
    { ...galleryField("installationImages", "전시장 전경 / 설치 전경"), description: "전시 상세 상단 우측에 표시할 공간·설치 전경입니다. 이미지별 제목 필드를 캡션으로 사용할 수 있으며, 등록 순서대로 썸네일과 팝업에 표시됩니다. 비어 있으면 기존 대표 이미지를 사용합니다." },
    { ...galleryField("artworkImages", "전시 작품 그리드"), description: "전시 상세 하단 작품 섹션에 표시할 개별 작품입니다. 각 이미지에서 작품명, 연도, 재료/기법, 크기를 입력할 수 있습니다. 비어 있으면 기존 전시 이미지 갤러리를 사용합니다." },
    textField("shortDescription", "짧은 설명"), richTextField("description", "전체 설명"),
    defineField({ name: "status", title: "전시 상태", type: "string", initialValue: "upcoming", options: { list: [{ title: "현재 전시", value: "current" }, { title: "예정 전시", value: "upcoming" }, { title: "지난 전시", value: "archive" }], layout: "radio" }, description: "공개 사이트는 한국 날짜 기준으로 종료일 다음 날 지난 전시로 분류합니다. 종료된 전시 중 가장 최근 1개는 PAST, 나머지는 ARCHIVE에 표시됩니다. 날짜가 없으면 이 상태값을 사용합니다.", validation: (rule) => rule.required() }),
    orderField,
  ], orderings: [displayOrder], preview: { select: { title: "title", subtitle: "status", media: "mainImage" } },
});
