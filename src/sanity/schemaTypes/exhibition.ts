import { defineField, defineType } from "sanity";
import { titleField, slugField, imageField, galleryField, textField, richTextField, artistField, featuredField, orderField, displayOrder } from "./shared";

export const exhibition = defineType({
  name: "exhibition", title: "전시", type: "document",
  fields: [
    titleField(), slugField(), artistField,
    defineField({ name: "startDate", title: "시작일", type: "date" }),
    defineField({ name: "endDate", title: "종료일", type: "date", validation: (rule) => rule.custom((value, context) => !value || !context.document?.startDate || value >= String(context.document.startDate) ? true : "종료일은 시작일보다 빠를 수 없습니다.") }),
    imageField("mainImage", "대표 이미지"), galleryField("galleryImages", "전시 이미지 갤러리"),
    textField("shortDescription", "짧은 설명"), richTextField("description", "전체 설명"),
    defineField({ name: "status", title: "전시 상태", type: "string", initialValue: "upcoming", options: { list: [{ title: "현재 전시", value: "current" }, { title: "예정 전시", value: "upcoming" }, { title: "지난 전시", value: "archive" }], layout: "radio" }, description: "날짜에 따라 자동 변경되지 않습니다. 상태를 직접 선택하세요.", validation: (rule) => rule.required() }),
    featuredField, orderField,
  ], orderings: [displayOrder], preview: { select: { title: "title", subtitle: "status", media: "mainImage" } },
});
