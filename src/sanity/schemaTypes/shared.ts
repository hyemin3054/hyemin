import { defineArrayMember, defineField } from "sanity";

export const titleField = (name = "title", title = "제목") => defineField({
  name, title, type: "string", validation: (rule) => rule.required(),
});
export const slugField = (source = "title") => defineField({
  name: "slug", title: "페이지 주소", type: "slug", options: { source, maxLength: 96 },
  description: "웹사이트 주소에 사용됩니다. 보통 Generate 버튼을 사용하세요. 한글 이름은 영문 소문자·숫자·하이픈으로 직접 입력하세요. 공개 후 변경하면 기존 주소가 바뀝니다.",
  validation: (rule) => rule.required().custom((value) =>
    !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
      ? true : "영문 소문자, 숫자, 하이픈으로 주소를 입력해주세요."),
});
export const imageField = (name: string, title: string) => defineField({ name, title, type: "contentImage" });
export const galleryField = (name: string, title: string) => defineField({
  name, title, type: "array", of: [defineArrayMember({ type: "contentImage" })],
  options: { sortable: true }, description: "이미지를 추가·교체·삭제할 수 있습니다. 드래그하여 순서를 바꾸세요. 사진은 나중에 등록해도 됩니다.",
});
export const richTextField = (name: string, title: string) => defineField({ name, title, type: "richText" });
export const textField = (name: string, title: string) => defineField({ name, title, type: "text", rows: 4 });
export const artistField = defineField({
  name: "artist", title: "작가", type: "reference", to: [{ type: "artist" }],
  description: "ARTIST에서 먼저 등록한 작가를 선택하세요. 참조한 작가를 먼저 Publish해야 합니다. 미정이면 비워둘 수 있습니다.",
});
export const featuredField = defineField({ name: "featured", title: "주요 콘텐츠로 표시", type: "boolean", initialValue: false, description: "주요 영역에 소개할 콘텐츠를 지정합니다. 공개하려면 별도로 Publish해야 합니다." });
export const orderField = defineField({ name: "displayOrder", title: "표시 순서", type: "number", description: "숫자가 작은 콘텐츠가 먼저 표시됩니다.", initialValue: 100, validation: (rule) => rule.integer().min(0) });
export const displayOrder = { title: "표시 순서", name: "displayOrder", by: [{ field: "displayOrder", direction: "asc" as const }] };
export const historyField = (name: string, title: string) => defineField({
  name, title, type: "array", of: [defineArrayMember({ type: "historyEntry" })], options: { sortable: true },
});
