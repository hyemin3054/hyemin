import { defineField, defineType } from "sanity";
import { titleField, slugField, imageField, richTextField, artistField, featuredField, orderField, displayOrder } from "./shared";

export const salesArtwork = defineType({
  name: "salesArtwork", title: "판매 작품", type: "document",
  fields: [
    titleField(), slugField(), artistField, defineField({ name: "year", title: "제작 연도", type: "string" }),
    imageField("mainImage", "대표 이미지"),
    defineField({ name: "medium", title: "재료 / 기법", type: "string" }), defineField({ name: "dimensions", title: "크기", type: "string", description: "예: 60 × 80 cm" }),
    defineField({ name: "price", title: "가격 (KRW 원)", type: "number", description: "숫자만 입력하세요. 미입력 시 가격 문의로 표시합니다. 온라인 결제는 없습니다.", validation: (rule) => rule.min(0).integer() }),
    defineField({ name: "availability", title: "판매 상태", type: "string", initialValue: "available", options: { list: [{ title: "구매 가능", value: "available" }, { title: "예약됨", value: "reserved" }, { title: "판매 완료", value: "sold" }], layout: "radio" }, validation: (rule) => rule.required() }),
    richTextField("description", "작품 설명"), featuredField, orderField,
  ], orderings: [displayOrder], preview: { select: { title: "title", subtitle: "availability", media: "mainImage" } },
});
