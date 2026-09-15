"use client";
import { useState } from "react";

export function ExhibitionImage({ src, alt }: { src: string | null; alt: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return src && failedSrc !== src ? <img src={src} alt={alt} onError={() => setFailedSrc(src)} /> : <span className="exhibition-image-placeholder">이미지 준비 중</span>;
}
