"use client";
import { useState } from "react";
import { NewsImage } from "./NewsImage";

export function NewsGallery({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(0);
  if (!images.length) return null;
  const active = selected < images.length ? selected : 0;
  return <div className="news-gallery">
    <div className="news-detail-image"><NewsImage key={images[active]} src={images[active]} alt={`${title} 이미지 ${active + 1}`} /></div>
    {images.length > 1 && <div className="news-thumbnails" aria-label="소식 이미지 선택">{images.map((src, index) =>
      <button key={`${src}-${index}`} type="button" aria-label={`이미지 ${index + 1} 보기`} aria-pressed={index === active} onClick={() => setSelected(index)}>
        <NewsImage src={src} alt="" />
      </button>)}</div>}
  </div>;
}
