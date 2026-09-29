import { HeroImageInput } from "../components/HeroImageInput";
import { defineArrayMember, defineField, defineType } from "sanity";
import { imageField, textField, richTextField, galleryField } from "./shared";

export const siteSettings = defineType({
  name: "siteSettings", title: "사이트 전체 설정", type: "document",
  fields: [{ ...galleryField("heroImages", "홈 Hero 이미지"), of: [defineArrayMember({ type: "contentImage", components: { input: HeroImageInput } })], description: "이미지를 열어 Crop(자르기)과 Hotspot(중심점)을 조절하세요. 지정한 위치를 우선해 1440:530 Hero에 맞춥니다. 수정 후 Publish하고 홈페이지를 새로고침하세요. 드래그로 순서를 변경할 수 있으며, 비워두면 갤러리 소개의 첫 이미지를 사용합니다." }, imageField("logo", "로고"), textField("address", "주소"), textField("openingHours", "운영 시간"),
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
