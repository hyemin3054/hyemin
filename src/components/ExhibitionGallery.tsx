"use client";
import { useRef, useState, type ReactNode } from "react";
import { ArtworkViewer } from "./ArtworkViewer";
import { ContentVisual } from "./ContentVisual";
import { ImageIndicators } from "./ImageIndicators";
import { ImageDissolve } from "./ImageDissolve";

export type ExhibitionSlide = { src: string; fullSrc: string; title?: string | null; year?: string | null; medium?: string | null; size?: string | null };
const captionLine = (...values: (string | null | undefined)[]) => values.map(value => value?.trim()).filter(Boolean).join(", ");
const protectedSize = (value?: string | null) => value?.trim().replace(/(\d)\s*[×x]\s*(\d)/gi, "$1\u00a0×\u00a0$2").replace(/(\d)\s+(cm|mm|m)\b/gi, "$1\u00a0$2");

export function ExhibitionGallery({ images, title, layout = "detail", information, href, label }: { images: ExhibitionSlide[]; title: string; layout?: "detail" | "home" | "list"; information?: ReactNode; href?: string; label?: ReactNode }) {
  const visibleImages = layout === "detail" ? images : images.slice(0, 4);
  const [selected, setSelected] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const main = useRef<HTMLDivElement>(null);
  const swipeAnimation = useRef<Animation | null>(null);
  if (!visibleImages.length) return <div className="exhibition-viewer-empty">{information}</div>;
  const active = Math.min(preview ?? selected, visibleImages.length - 1);
  const image = visibleImages[active];
  const select = (index: number) => { setSelected(index); setPreview(null); };
  const swipe = (direction: number) => {
    select((selected + direction + visibleImages.length) % visibleImages.length);
    if (layout !== "detail" && matchMedia("(max-width: 800px) and (prefers-reduced-motion: no-preference)").matches) {
      swipeAnimation.current?.cancel();
      swipeAnimation.current = main.current?.animate(
        [{ transform: `translateX(${direction * 12}px)` }, { transform: "translateX(0)" }],
        { duration: 220, easing: "ease-out" },
      ) ?? null;
    }
  };
  const firstLine = captionLine(image.title, image.year);
  const secondLine = captionLine(protectedSize(image.size), image.medium);
  const thumbnails = visibleImages.length > 1 && <div className="exhibition-thumbnail-navigation"><div className="exhibition-thumbnails" role="group" aria-label="작품 선택" onMouseLeave={() => setPreview(null)}>{visibleImages.map((slide, index) => (
      <button key={`${slide.src}-${index}`} type="button" aria-label={`${slide.title || title} 이미지 ${index + 1}`} aria-pressed={selected === index} onPointerEnter={event => { if (event.pointerType === "mouse") setPreview(index); }} onFocus={() => setPreview(index)} onBlur={() => setPreview(null)} onClick={() => select(index)}><ContentVisual src={slide.src} alt="" /></button>
    ))}</div></div>;
  return <section className={`exhibition-viewer exhibition-viewer--${layout}${layout !== "detail" ? " exhibition-preview" : ""}`} aria-label="전시 작품 이미지">
    {information && <div className="exhibition-viewer-information">{label}<div>{information}</div>{layout !== "detail" && thumbnails}</div>}
    {layout === "detail" && thumbnails}
    <div ref={main} className="exhibition-viewer-main"><ArtworkViewer className="exhibition-enlarge" src={image.src} fullSrc={image.fullSrc} alt={image.title || `${title} 이미지 ${active + 1}`} href={layout !== "detail" ? href : undefined} magnifier={layout !== "home"} images={visibleImages} initialIndex={active} swipeThreshold={layout === "detail" ? 40 : 24} onSwipe={swipe}>{layout === "home" ? <ImageDissolve imageKey={image.src} src={image.src}><ContentVisual src={image.src} alt={image.title || `${title} 이미지 ${active + 1}`} /></ImageDissolve> : undefined}</ArtworkViewer></div>
    <div className="exhibition-viewer-indicators">{layout === "detail" && visibleImages.length > 1 && <button className="artwork-step" type="button" aria-label="이전 작품 이미지" onClick={() => select((selected - 1 + visibleImages.length) % visibleImages.length)}>&lt;</button>}<ImageIndicators count={visibleImages.length} active={active} onSelect={select} />{layout === "detail" && visibleImages.length > 1 && <button className="artwork-step" type="button" aria-label="다음 작품 이미지" onClick={() => select((selected + 1) % visibleImages.length)}>&gt;</button>}</div>
    {(firstLine || secondLine) && <div className="exhibition-caption" aria-live="polite">{firstLine && <p>{firstLine}</p>}{secondLine && <p>{secondLine}</p>}</div>}
  </section>;
}
