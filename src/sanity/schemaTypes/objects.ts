import { defineArrayMember, defineField, defineType } from "sanity";

export const contentImage = defineType({
  name: "contentImage", title: "이미지", type: "image", options: { hotspot: true },
});
export const richText = defineType({
  name: "richText", title: "본문", type: "array", of: [defineArrayMember({
    type: "block", styles: [{ title: "본문", value: "normal" }, { title: "소제목", value: "h2" }, { title: "작은 소제목", value: "h3" }, { title: "인용", value: "blockquote" }],
    marks: { decorators: [{ title: "굵게", value: "strong" }, { title: "기울임", value: "em" }], annotations: [] },
  })],
});
export const historyEntry = defineType({
  name: "historyEntry", title: "이력 항목", type: "object",
  fields: [defineField({ name: "year", title: "연도 / 기간", type: "string" }), defineField({ name: "description", title: "내용", type: "text", rows: 3 })],
  preview: { select: { title: "description", subtitle: "year" } },
});
export const artistWork = defineType({
  name: "artistWork", title: "작품", type: "object",
  fields: [
    defineField({ name: "image", title: "이미지", type: "contentImage" }),
    defineField({ name: "title", title: "작품명", type: "string" }),
    defineField({ name: "year", title: "제작 연도", type: "string" }),
    defineField({ name: "description", title: "작품 설명", type: "text", rows: 4 }),
  ],
  preview: { select: { title: "title", subtitle: "year", media: "image" }, prepare: ({ title, subtitle, media }) => ({ title: title || "제목 미입력 작품", subtitle, media }) },
});
