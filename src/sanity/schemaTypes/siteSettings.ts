import { defineField, defineType } from "sanity";
import { imageField, textField, richTextField, galleryField } from "./shared";

export const siteSettings = defineType({
  name: "siteSettings", title: "사이트 전체 설정", type: "document",
  fields: [imageField("logo", "로고"), textField("address", "주소"), textField("openingHours", "운영 시간"),
    defineField({ name: "telephone", title: "전화", type: "string" }), defineField({ name: "email", title: "이메일", type: "string", validation: (rule) => rule.email() }),
    defineField({ name: "instagram", title: "Instagram 주소", type: "url", validation: (rule) => rule.uri({ scheme: ["https"] }) }),
    defineField({ name: "copyright", title: "저작권 문구", type: "string" }), richTextField("aboutText", "갤러리 소개"), galleryField("aboutImages", "갤러리 소개 이미지"),
    defineField({ name: "mapInformation", title: "지도 / 찾아오는 길", type: "object", fields: [
      defineField({ name: "location", title: "지도 좌표 (선택)", type: "geopoint" }),
      defineField({ name: "mapUrl", title: "지도 링크", type: "url", validation: (rule) => rule.uri({ scheme: ["https", "http"] }) }),
      textField("directions", "오시는 길 / 주차 안내"),
    ] }),
  ], preview: { select: { media: "logo" }, prepare: ({ media }) => ({ title: "사이트 전체 설정", media }) },
});
