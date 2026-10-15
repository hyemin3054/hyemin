"use client";
import { useClient, type ImageInputProps } from "sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
export function HeroImageInput(props: ImageInputProps) {
  const client = useClient({ apiVersion: "2025-02-19" });
  const src = props.value?.asset?._ref ? createImageUrlBuilder(client).image({ asset: props.value.asset }).width(1440).fit("max").auto("format").url() : null;
  return <div>{props.renderDefault(props)}{src && <figure style={{ margin: "16px 0 0" }}><figcaption style={{ fontSize: 13, marginBottom: 8 }}>HOME Hero 전체 이미지 미리보기 · 고정 프레임 안에서 원본 비율 유지<br />웹사이트에서는 이미지가 잘리지 않고 중앙에 표시됩니다. 수정 후 Publish하고 홈페이지를 새로고침하세요.</figcaption><div style={{ display: "grid", placeItems: "center", width: "100%", aspectRatio: "1440 / 530", overflow: "hidden", background: "#f6f4f0" }}><img src={src} alt="HOME Hero 전체 이미지 미리보기" style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }} /></div></figure>}</div>;
}
