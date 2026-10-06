import { defineField, defineType } from "sanity";
import { titleField, slugField, imageField, galleryField, textField, richTextField, artistField, orderField, displayOrder } from "./shared";

export const exhibition = defineType({
  name: "exhibition", title: "전시", type: "document",
  fields: [
    titleField(), slugField(), artistField,
    defineField({ name: "startDate", title: "시작일", type: "date" }),
    defineField({ name: "endDate", title: "종료일", type: "date", validation: (rule) => rule.custom((value, context) => !value || !context.document?.startDate || value >= String(context.document.startDate) ? true : "종료일은 시작일보다 빠를 수 없습니다.") }),
    imageField("mainImage", "대표 이미지"),
    { ...galleryField("galleryImages", "전시 이미지 갤러리"), description: "대표 이미지 외 최대 3개를 등록할 수 있습니다. 대표 이미지를 포함해 공개 화면에는 최대 4개의 이미지가 표시됩니다.", validation: (rule) => rule.max(3).warning("대표 이미지를 포함해 최대 4개의 이미지만 등록할 수 있습니다. 기존 이미지는 자동 삭제되지 않습니다.") },
    textField("shortDescription", "짧은 설명"), richTextField("description", "전체 설명"),
    defineField({ name: "status", title: "전시 상태", type: "string", initialValue: "upcoming", options: { list: [{ title: "현재 전시", value: "current" }, { title: "예정 전시", value: "upcoming" }, { title: "지난 전시", value: "archive" }], layout: "radio" }, description: "공개 사이트는 한국 날짜 기준으로 종료일 다음 날 지난 전시로 분류합니다. 종료된 전시 중 가장 최근 1개는 PAST, 나머지는 ARCHIVE에 표시됩니다. 날짜가 없으면 이 상태값을 사용합니다.", validation: (rule) => rule.required() }),
    orderField,
  ], orderings: [displayOrder], preview: { select: { title: "title", subtitle: "status", media: "mainImage" } },
});
