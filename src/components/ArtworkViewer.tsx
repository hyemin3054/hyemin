"use client";
import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import Link from "next/link";
import { ContentVisual } from "./ContentVisual";

export type ArtworkSlide = { src: string; fullSrc?: string; title?: string | null; year?: string | null; medium?: string | null; size?: string | null; caption?: string[] };
function ViewerVisual({ image, alt }: { image: ArtworkSlide; alt: string }) {
  const [source, setSource] = useState(image.src);
  useEffect(() => {
    if (!image.fullSrc || image.fullSrc === image.src) return;
    let active = true;
    const full = new Image();
    full.onload = () => { if (active) setSource(image.fullSrc!); };
    full.src = image.fullSrc;
    return () => { active = false; };
  }, [image.src, image.fullSrc]);
  return <ContentVisual src={source} alt={image.title || alt} />;
}
export function ArtworkLightbox({ images, initialIndex, alt, contact, onClose }: { images: ArtworkSlide[]; initialIndex: number; alt: string; contact?: ReactNode; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(Math.min(initialIndex, images.length - 1));
  const image = images[index];
  const change = (direction: number) => setIndex(value => (value + direction + images.length) % images.length);
  useEffect(() => {
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element?.showModal(); document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = overflow; };
  }, []);
  const caption = image.caption || [[image.title, image.year].filter(Boolean).join(", "), [image.medium, image.size].filter(Boolean).join(", ")].filter(Boolean);
  return <dialog ref={dialog} className="artwork-lightbox grotto-viewer" aria-label={`${alt} 크게 보기`} onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); change(event.key === "ArrowLeft" ? -1 : 1); }
  }}>
    <button className="viewer-close" type="button" onClick={onClose} autoFocus aria-label="확대 이미지 닫기">×</button>
    <div className="viewer-stage">
      <button className="viewer-previous" type="button" disabled={images.length < 2} onClick={() => change(-1)} aria-label="이전 작품">&lt;</button>
      <figure className="viewer-artwork" key={index}>
        <div className="viewer-window"><ViewerVisual image={image} alt={alt} /></div>
        <figcaption aria-live="polite"><p className="viewer-index">{String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</p>{caption.map((line, i) => <p key={i}>{line}</p>)}{contact && <div className="viewer-contact">{contact}</div>}</figcaption>
      </figure>
      <button className="viewer-next" type="button" disabled={images.length < 2} onClick={() => change(1)} aria-label="다음 작품">&gt;</button>
    </div>
  </dialog>;
}

export function ArtworkViewer({ src, fullSrc, alt, className = "", href, magnifier = true, images, initialIndex = 0, contact, onSwipe, children }: { src: string | null; fullSrc?: string; alt: string; className?: string; href?: string; magnifier?: boolean; images?: ArtworkSlide[]; initialIndex?: number; contact?: ReactNode; onSwipe?: (direction: number) => void; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [lens, setLens] = useState<{x: number; y: number; width: number; height: number; px: number; py: number} | null>(null);
  const start = useRef<{x: number; y: number} | null>(null);
  const swiped = useRef(false);
  const move = (event: PointerEvent<HTMLElement>) => {
    if (!magnifier || event.pointerType !== "mouse" || !matchMedia("(min-width: 801px) and (hover: hover) and (pointer: fine)").matches) return;
    const img = event.currentTarget.querySelector("img");
    if (!img?.naturalWidth) return;
    const frame = event.currentTarget.getBoundingClientRect(), rect = img.getBoundingClientRect();
    const scale = Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight);
    const width = img.naturalWidth * scale, height = img.naturalHeight * scale;
    const px = event.clientX - rect.left - (rect.width - width) / 2, py = event.clientY - rect.top - (rect.height - height) / 2;
    setLens(px < 0 || py < 0 || px > width || py > height ? null : { x: event.clientX - frame.left, y: event.clientY - frame.top, width, height, px, py });
  };
  const content = <>{children || <ContentVisual src={src} alt={alt} />}{lens && src && <span aria-hidden="true" className="artwork-lens" style={{ left: lens.x, top: lens.y, backgroundImage: `url("${src}")`, backgroundSize: `${lens.width * 2}px ${lens.height * 2}px`, backgroundPosition: `${80 - lens.px * 2}px ${80 - lens.py * 2}px` }} />}</>;
  const props = {
    className: `artwork-viewer ${className}`,
    onPointerMove: move,
    onPointerLeave: () => setLens(null),
    onDragStart: (event: React.DragEvent) => event.preventDefault(),
    onPointerDown: (event: PointerEvent<HTMLElement>) => { swiped.current = false; start.current = {x: event.clientX, y: event.clientY}; if (onSwipe) event.currentTarget.setPointerCapture(event.pointerId); },
    onPointerCancel: () => { start.current = null; },
    onPointerUp: (event: PointerEvent<HTMLElement>) => {
      const first = start.current; start.current = null;
      if (first && onSwipe && Math.abs(event.clientX - first.x) > 40 && Math.abs(event.clientX - first.x) > Math.abs(event.clientY - first.y)) { swiped.current = true; setLens(null); onSwipe(event.clientX < first.x ? 1 : -1); }
    },
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      if (swiped.current) { event.preventDefault(); swiped.current = false; return; }
      if (href) return;
      event.preventDefault(); if (src) { setLens(null); setOpen(true); }
    },
  };
  return <>{href ? <Link {...props} href={href} aria-label={`${alt} 전시 상세 보기`}>{content}</Link> : <button {...props} type="button" disabled={!src} aria-label={`${alt} 크게 보기`}>{content}</button>}{open && src && <ArtworkLightbox images={images?.length ? images : [{ src, fullSrc, title: alt }]} initialIndex={initialIndex} alt={alt} contact={contact} onClose={() => setOpen(false)} />}</>;
}
