"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ContentVisual } from "./ContentVisual";
import { ImageDissolve } from "./ImageDissolve";
import { ImageIndicators } from "./ImageIndicators";

const HERO_DURATION_MS = 15000;

export function ImageCarousel({ images, alt, frameClass, href, thumbnails = false, autoPlay = false }: { images: string[]; alt: string; frameClass: string; href?: string; thumbnails?: boolean; autoPlay?: boolean }) {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cycle, setCycle] = useState(0);
  const elapsed = useRef(0);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const select = (index: number) => { setSelected(index); setProgress(0); setCycle(value => value + 1); };
  useEffect(() => {
    elapsed.current = 0;
    if (!autoPlay || images.length < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let frame = 0;
    let previous: number | null = null;
    const tick = (time: number) => {
      if (cancelled) return;
      if (document.hidden || pausedRef.current || reduced.matches) previous = null;
      else {
        if (previous !== null) elapsed.current += time - previous;
        previous = time;
        if (elapsed.current >= HERO_DURATION_MS) {
          setProgress(0);
          setSelected(index => (index + 1) % images.length);
          return;
        }
        setProgress(elapsed.current / HERO_DURATION_MS);
      }
      frame = requestAnimationFrame(tick);
    };
    // Start the clock only once the selected image can actually be displayed.
    const image = new Image();
    image.src = images[selected] || images[0];
    image.decode().catch(() => {}).then(() => { if (!cancelled) frame = requestAnimationFrame(tick); });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [autoPlay, images, selected, cycle]);
  const active = selected < images.length ? selected : 0;
  const visual = <ImageDissolve imageKey={images[active] || "empty"} src={images[active] || null}><ContentVisual src={images[active] || null} alt={alt} /></ImageDissolve>;
  return <div className="image-carousel">
    {href ? <Link className={frameClass} href={href} aria-label={`${alt} 상세`}>{visual}</Link> : <div className={frameClass}>{visual}</div>}
    {autoPlay && images.length > 1 ? <div className="hero-slider-controls">
      <button type="button" aria-label="이전 전경 이미지" onClick={() => select((active - 1 + images.length) % images.length)}>&lt;</button>
      <ImageIndicators count={images.length} active={active} onSelect={select} />
      <button type="button" aria-label="다음 전경 이미지" onClick={() => select((active + 1) % images.length)}>&gt;</button>
      <button type="button" aria-label={paused ? "전경 자동 전환 재생" : "전경 자동 전환 일시정지"} onClick={() => setPaused(value => !value)}>{paused ? "▷" : "Ⅱ"}</button>
    </div> : <ImageIndicators count={images.length} active={active} onSelect={select} />}
    {autoPlay && images.length > 1 && <div className="hero-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>}
    {thumbnails && images.length > 1 && <div className="image-carousel-thumbnails">{images.slice(1).map((src, index) => <button key={`${src}-${index}`} type="button" aria-label={`관련 이미지 ${index + 1}`} aria-pressed={active === index + 1} onClick={() => select(index + 1)}><ContentVisual src={src} alt="" /></button>)}</div>}
  </div>;
}
