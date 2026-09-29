"use client";
import { useClient, type ImageInputProps } from "sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
export function HeroImageInput(props: ImageInputProps) {
  const client = useClient({ apiVersion: "2025-02-19" });
  const src = props.value?.asset?._ref ? createImageUrlBuilder(client).image(props.value).width(1440).height(530).fit("crop").auto("format").url() : null;
  return <div>{props.renderDefault(props)}{src && <figure style={{ margin: "16px 0 0" }}><figcaption style={{ fontSize: 13, marginBottom: 8 }}>HOME Hero 미리보기 · 1440 × 530<br />Crop / Hotspot 조절 결과가 아래에 반영됩니다. 홈페이지에는 Publish 후 표시됩니다.</figcaption><img src={src} alt="1440:530 Hero 자르기 미리보기" style={{ display: "block", width: "100%", aspectRatio: "1440 / 530", objectFit: "cover" }} /></figure>}</div>;
}
