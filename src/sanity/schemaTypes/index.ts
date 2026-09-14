import { artist } from "./artist";
import { exhibition } from "./exhibition";
import { news } from "./news";
import { salesArtwork } from "./salesArtwork";
import { siteSettings } from "./siteSettings";
import { contentImage, richText, artistWork, historyEntry } from "./objects";

// Studio presentation only: stored field names and website queries remain unchanged.
const images = new Set(["portrait", "representativeImage", "mainImage", "galleryImages"]);
const details = new Set(["fullBio", "works", "selectedExhibitions", "education", "awards", "description", "body"]);
const display = new Set(["displayOrder", "featured"]);
const contentSchemas = [artist, exhibition, news, salesArtwork].map((schema) => ({
  ...schema,
  groups: [
    { name: "basic", title: "기본 정보", default: true },
    { name: "images", title: "이미지" },
    { name: "details", title: "상세 내용" },
    { name: "display", title: "정렬 및 표시 설정" },
  ],
  fields: schema.fields.map((field) => ({
    ...field,
    group: images.has(field.name) ? "images" : details.has(field.name) ? "details" : display.has(field.name) ? "display" : "basic",
  })),
}));

export const schemaTypes = [...contentSchemas, siteSettings, contentImage, richText, artistWork, historyEntry];
