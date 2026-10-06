import { defineArrayMember, defineField, defineType } from "sanity";

export const contentImage = defineType({
  name: "contentImage", title: "이미지", type: "image", options: { hotspot: true },
  fields: [
    defineField({ name: "title", title: "작품 제목 · Group 1", type: "string", hidden: ({ document }) => !["exhibition", "artist"].includes(String(document?._type)) }),
    defineField({ name: "year", title: "제작 연도 · Group 1", type: "string", hidden: ({ document }) => !["exhibition", "artist"].includes(String(document?._type)) }),
    defineField({ name: "size", title: "작품 크기 · Group 2", type: "string", description: "예: 130 × 162 cm. 숫자와 단위를 함께 입력하세요.", hidden: ({ document }) => !["exhibition", "artist"].includes(String(document?._type)) }),
    defineField({ name: "medium", title: "재료 / 기법 · Group 2", type: "string", description: "예: Oil on canvas. 캡션 항목은 모두 선택 입력입니다.", hidden: ({ document }) => !["exhibition", "artist"].includes(String(document?._type)) }),
  ],
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
