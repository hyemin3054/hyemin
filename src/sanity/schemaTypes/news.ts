import { defineField, defineType } from "sanity";
import { titleField, slugField, imageField, galleryField, textField, richTextField } from "./shared";

export const news = defineType({
  name: "news", title: "소식", type: "document",
  fields: [titleField(), slugField(), defineField({ name: "date", title: "게시 날짜", type: "date" }), imageField("mainImage", "대표 이미지"), { ...galleryField("detailImages", "추가 상세 이미지"), validation: (rule) => rule.max(5), description: "대표 이미지 외 최대 5장. 드래그하여 순서를 바꿀 수 있습니다." }, { ...galleryField("galleryImages", "기존 상세 이미지 (보존용)"), readOnly: true, hidden: ({ document }) => !Array.isArray(document?.galleryImages) || document.galleryImages.length === 0, description: "기존 이미지는 보존됩니다. 추가 상세 이미지를 등록하면 공개 페이지는 새 목록을 사용합니다." }, textField("excerpt", "요약"), richTextField("body", "본문")],
  orderings: [{ title: "최신 날짜순", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "date", media: "mainImage" } },
});
