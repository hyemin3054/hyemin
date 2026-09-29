"use client";
import { useState } from "react";
export function ContentVisual({ src, alt }: { src: string | null; alt: string }) {
  const [failed, setFailed] = useState<string | null>(null);
  // Reserve the Sanity image's intrinsic ratio before its bytes arrive.
  const assetSize = src?.match(/-(\d+)x(\d+)\.[a-z]+(?:\?|$)/i);
  const query = src ? new URLSearchParams(src.split("?")[1] || "") : null;
  const rect = query?.get("rect")?.split(",").map(Number);
  const sized = query?.get("w") && query?.get("h");
  const width = sized ? Number(query!.get("w")) : rect?.[2] || Number(assetSize?.[1]) || undefined;
  const height = sized ? Number(query!.get("h")) : rect?.[3] || Number(assetSize?.[2]) || undefined;
  return src && failed !== src ? <img width={width} height={height} src={src} alt={alt} onError={() => setFailed(src)} /> : <span className="content-visual-empty">이미지 준비 중</span>;
}
