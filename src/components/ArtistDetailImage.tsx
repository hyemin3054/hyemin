"use client";

import { useState } from "react";

export function ArtistDetailImage({ src, alt }: { src: string | null; alt: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return src && failedSrc !== src
    ? <img src={src} alt={alt} onError={() => setFailedSrc(src)} />
    : <p className="artist-image-placeholder">이미지 준비 중</p>;
}
