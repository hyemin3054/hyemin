import { HeroImageInput } from "../components/HeroImageInput";
import { defineArrayMember, defineField, defineType } from "sanity";
import { imageField, textField, richTextField, galleryField } from "./shared";

export const siteSettings = defineType({
  name: "siteSettings", title: "사이트 전체 설정", type: "document",
  fields: [{ ...galleryField("heroImages", "홈 Hero 이미지"), of: [defineArrayMember({ type: "contentImage", components: { input: HeroImageInput } })], description: "원본 이미지 전체가 고정 Hero 프레임 안에 비율을 유지한 채 표시됩니다. Crop/Hotspot 값은 보존되지만 HOME Hero에서는 잘림 방지를 위해 사용하지 않습니다. 드래그로 순서를 변경할 수 있으며, 비워두면 갤러리 소개의 첫 이미지를 사용합니다." }, imageField("logo", "로고"), textField("address", "주소"), textField("openingHours", "운영 시간"),
    defineField({ name: "telephone", title: "전화", type: "string" }), defineField({ name: "email", title: "이메일", type: "string", validation: (rule) => rule.email() }),
    defineField({ name: "instagram", title: "Instagram 주소", type: "url", validation: (rule) => rule.uri({ scheme: ["https"] }) }),
    defineField({ name: "copyright", title: "저작권 문구", type: "string" }), { ...richTextField("aboutText", "이전 갤러리 소개 (보존)"), hidden: ({ document }) => Array.isArray(document?.aboutSections), readOnly: true },
    defineField({ name: "aboutSections", title: "ABOUT 섹션", type: "array", options: { sortable: true }, description: "각 섹션의 제목, 본문, 이미지를 개별 편집합니다. 이미지가 없으면 텍스트만 표시합니다.", of: [defineArrayMember({ name: "aboutSection", title: "소개 섹션", type: "object", fields: [defineField({ name: "title", title: "섹션 제목", type: "string" }), richTextField("body", "본문"), imageField("image", "섹션 이미지 (선택)")], preview: { select: { title: "title", media: "image" } } })] }),
    defineField({ name: "aboutFeatureImage", title: "기존 ABOUT 이미지 창 (보존용)", type: "contentImage", hidden: true, readOnly: true }),
    defineField({ name: "showAboutFeatureImage", title: "기존 ABOUT 이미지 표시 설정 (보존용)", type: "boolean", hidden: true, readOnly: true }),
    { ...galleryField("aboutImages", "이전 ABOUT 이미지 (보존)"), hidden: ({ document }) => Array.isArray(document?.aboutSections), readOnly: true, description: "ABOUT 페이지에 표시할 이미지를 등록합니다. 여러 장을 추가하거나 삭제할 수 있으며, 드래그하여 표시 순서를 변경할 수 있습니다." },
    defineField({ name: "mapInformation", title: "지도 / 찾아오는 길", type: "object", fields: [
      defineField({ name: "location", title: "지도 좌표 (선택)", type: "geopoint" }),
      defineField({ name: "mapUrl", title: "지도 링크", type: "url", validation: (rule) => rule.uri({ scheme: ["https", "http"] }) }),
      textField("directions", "오시는 길 / 주차 안내"),
    ] }),
  ], preview: { select: { media: "logo" }, prepare: ({ media }) => ({ title: "사이트 전체 설정", media }) },
});
