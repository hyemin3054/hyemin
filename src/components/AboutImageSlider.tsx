"use client";

import { useRef, useState, type TouchEvent } from "react";
import { ContentVisual } from "./ContentVisual";
import { ImageDissolve } from "./ImageDissolve";

export type AboutSlide = { src: string; alt: string };

export function AboutImageSlider({ images }: { images: AboutSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  if (!images.length) return null;

  const select = (index: number) => setActiveIndex((index + images.length) % images.length);
  const active = images[activeIndex] || images[0];
  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    const touch = event.changedTouches[0];
    touchStart.current = null;
    if (!start || !touch) return;
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return;
    select(activeIndex + (deltaX < 0 ? 1 : -1));
  };

  return <section className="about-image-slider" aria-label="ABOUT 이미지">
    <div className="about-image-frame" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
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
