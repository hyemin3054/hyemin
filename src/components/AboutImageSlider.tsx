"use client";

import { useState } from "react";
import { ContentVisual } from "./ContentVisual";
import { ImageDissolve } from "./ImageDissolve";
import { useImageSwipe, useAdjacentImages } from "./useImageSwipe";

export type AboutSlide = { src: string; alt: string };

export function AboutImageSlider({ images }: { images: AboutSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const select = (index: number) => setActiveIndex((index + images.length) % images.length);
  const swipe = useImageSwipe(images.length > 1 ? direction => select(activeIndex + direction) : undefined);
  useAdjacentImages(images.map(image => image.src), activeIndex);
  if (!images.length) return null;
  const active = images[activeIndex] || images[0];

  return <section className="about-image-slider" aria-label="ABOUT 이미지">
    <div className="about-image-frame" {...swipe.handlers} onDragStart={event => event.preventDefault()} onClickCapture={event => { if (swipe.suppressClick.current) { event.preventDefault(); event.stopPropagation(); } }}>
      <ImageDissolve imageKey={active.src} src={active.src}>
        <ContentVisual src={active.src} alt={active.alt} />
      </ImageDissolve>
      {images.length > 1 && <>
        <button className="about-image-step about-image-step--previous" type="button" aria-label="이전 ABOUT 이미지" onClick={() => select(activeIndex - 1)}>&lt;</button>
        <button className="about-image-step about-image-step--next" type="button" aria-label="다음 ABOUT 이미지" onClick={() => select(activeIndex + 1)}>&gt;</button>
      </>}
    </div>
  </section>;
}
