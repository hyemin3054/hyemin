import { defineField, defineType } from "sanity";
import { titleField, slugField, imageField, galleryField, textField, richTextField, featuredField } from "./shared";

export const news = defineType({
  name: "news", title: "소식", type: "document",
  fields: [titleField(), slugField(), defineField({ name: "date", title: "게시 날짜", type: "date" }), imageField("mainImage", "대표 이미지"), galleryField("galleryImages", "상세 이미지 갤러리"), textField("excerpt", "요약"), richTextField("body", "본문"), featuredField],
  orderings: [{ title: "최신 날짜순", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "date", media: "mainImage" } },
});
