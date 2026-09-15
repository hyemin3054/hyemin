"use client";
import { useState } from "react";
export function ContentVisual({ src, alt }: { src: string | null; alt: string }) {
  const [failed, setFailed] = useState<string | null>(null);
  return src && failed !== src ? <img src={src} alt={alt} onError={() => setFailed(src)} /> : <span className="content-visual-empty">이미지 준비 중</span>;
}
