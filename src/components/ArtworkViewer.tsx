"use client";
import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useImageSwipe, useAdjacentImages } from "./useImageSwipe";
import { ContentVisual } from "./ContentVisual";

export type ArtworkSlide = { src: string; fullSrc?: string; title?: string | null; year?: string | null; medium?: string | null; size?: string | null; caption?: string[] };
function ViewerVisual({ image, alt }: { image: ArtworkSlide; alt: string }) {
  const fullSource = image.fullSrc || (image.src.includes("cdn.sanity.io/images/") ? image.src.split("?")[0] : image.src);
  const [source, setSource] = useState(image.src);
  useEffect(() => {
    if (fullSource === image.src) return;
    let active = true;
    const full = new Image();
    full.onload = () => { if (active) setSource(fullSource); };
    full.src = fullSource;
    return () => { active = false; };
  }, [image.src, fullSource]);
  return <ContentVisual src={source} alt={image.title || alt} />;
}
export function ArtworkLightbox({ images, initialIndex, alt, contact, onClose }: { images: ArtworkSlide[]; initialIndex: number; alt: string; contact?: ReactNode; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const viewerWindow = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const view = useRef({ zoom: 1, x: 0, y: 0 });
  const gesture = useRef<{ x: number; y: number; pinched: boolean; moved: boolean; time: number } | null>(null);
  const tap = useRef<{ x: number; y: number; time: number } | null>(null);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [arrowsHidden, setArrowsHidden] = useState(false);
  const cancelTap = () => { if (tapTimer.current) clearTimeout(tapTimer.current); tapTimer.current = null; tap.current = null; };
  useEffect(() => () => cancelTap(), []);
  const touchPan = useRef<{ x: number; y: number; left: number; top: number; axis: "x" | "y" | null } | null>(null);
  const [index, setIndex] = useState(Math.min(initialIndex, images.length - 1));
  const [viewport, setViewport] = useState(view.current);
  const [panning, setPanning] = useState(false);
  const { zoom } = viewport;
  const image = images[index];
  const applyView = (next: typeof viewport) => {
    const frame = viewerWindow.current;
    const img = frame?.querySelector("img");
    next.zoom = Math.min(5, Math.max(1, next.zoom));
    if (frame && img?.naturalWidth) {
      const fit = Math.min(frame.clientWidth / img.naturalWidth, frame.clientHeight / img.naturalHeight);
      const maxX = Math.max(0, (img.naturalWidth * fit * next.zoom - frame.clientWidth) / 2);
      const maxY = Math.max(0, (img.naturalHeight * fit * next.zoom - frame.clientHeight) / 2);
      next.x = Math.max(-maxX, Math.min(maxX, next.x));
      next.y = Math.max(-maxY, Math.min(maxY, next.y));
    }
    if (next.zoom === 1) { next.x = 0; next.y = 0; }
    view.current = next; setViewport(next);
  };
  const change = (direction: number) => {
    cancelTap();
    pointers.current.clear(); gesture.current = null; setPanning(false);
    applyView({ zoom: 1, x: 0, y: 0 });
    setIndex(value => (value + direction + images.length) % images.length);
  };
  useAdjacentImages(images.map(slide => slide.src), index);
  const adjustZoom = (direction: number) => {
    const current = view.current;
    const nextZoom = Math.min(5, Math.max(1, current.zoom + direction * .25));
    applyView({ zoom: nextZoom, x: current.x * nextZoom / current.zoom, y: current.y * nextZoom / current.zoom });
  };
  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    touchPan.current = event.pointerType === "touch" && pointers.current.size === 1
      ? { x: event.clientX, y: event.clientY, left: view.current.x, top: view.current.y, axis: null } : null;
    if (pointers.current.size === 1) gesture.current = { x: event.clientX, y: event.clientY, pinched: false, moved: false, time: event.timeStamp };
    else if (gesture.current) { gesture.current.pinched = true; cancelTap(); }
    setPanning(true);
  };
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    const start = gesture.current;
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) { start.moved = true; cancelTap(); }
    const before = [...pointers.current.values()];
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const after = [...pointers.current.values()];
    const current = view.current;
    if (after.length >= 2) {
      const distance = (points: typeof after) => Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
      const rect = event.currentTarget.getBoundingClientRect();
      const center = (points: typeof after) => ({ x: (points[0].x + points[1].x) / 2 - rect.left - rect.width / 2, y: (points[0].y + points[1].y) / 2 - rect.top - rect.height / 2 });
      const from = center(before), to = center(after);
      const nextZoom = Math.min(5, Math.max(1, current.zoom * distance(after) / Math.max(1, distance(before))));
      const ratio = nextZoom / current.zoom;
      applyView({ zoom: nextZoom, x: to.x - (from.x - current.x) * ratio, y: to.y - (from.y - current.y) * ratio });
    } else if (current.zoom > 1) {
      const pan = touchPan.current;
      if (event.pointerType === "touch" && pan) {
        const dx = event.clientX - pan.x, dy = event.clientY - pan.y;
        // Ignore finger jitter, then keep one axis until this drag ends.
        if (!pan.axis) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
          pan.axis = Math.abs(dy) > Math.abs(dx) * 1.3 ? "y" : "x";
        }
        applyView({ ...current, x: pan.left + (pan.axis === "x" ? dx : 0), y: pan.top + (pan.axis === "y" ? dy : 0) });
      } else {
        applyView({ ...current, x: current.x + event.clientX - previous.x, y: current.y + event.clientY - previous.y });
      }
    }
  };
  const pointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const remaining = [...pointers.current.values()][0];
    touchPan.current = remaining && event.pointerType === "touch"
      ? { ...remaining, left: view.current.x, top: view.current.y, axis: null } : null;
    if (pointers.current.size) return;
    const start = gesture.current;
    gesture.current = null; setPanning(false);
    if (event.type === "pointercancel") cancelTap();
    if (event.type !== "pointercancel" && start && !start.pinched && !start.moved && event.timeStamp - start.time < 350 && Math.hypot(event.clientX - start.x, event.clientY - start.y) <= 8) {
      const last = tap.current;
      if (last && event.timeStamp - last.time <= 300 && Math.hypot(event.clientX - last.x, event.clientY - last.y) < 32) {
        cancelTap(); applyView({ zoom: 1, x: 0, y: 0 });
      } else {
        cancelTap(); tap.current = { x: event.clientX, y: event.clientY, time: event.timeStamp };
        // Wait briefly so a double tap resets zoom without flashing the arrows.
        tapTimer.current = setTimeout(() => { setArrowsHidden(value => !value); tap.current = null; tapTimer.current = null; }, 300);
      }
      return;
    }
    if (event.type !== "pointercancel" && start && !start.pinched && view.current.zoom === 1 && images.length > 1) {
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.3) change(dx < 0 ? 1 : -1);
    }
  };
  useEffect(() => {
    const resize = () => applyView({ zoom: 1, x: 0, y: 0 });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element?.showModal(); document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = overflow; };
  }, []);
  const protectedSize = image.size?.trim().replace(/(\d)\s*[×x]\s*(\d)/gi, "$1\u00a0×\u00a0$2").replace(/(\d)\s+(cm|mm|m)\b/gi, "$1\u00a0$2");
  const caption = image.caption || [[image.title, image.year].filter(Boolean).join(", "), [protectedSize, image.medium].filter(Boolean).join(", ")].filter(Boolean);
  return createPortal(<dialog ref={dialog} className="artwork-lightbox grotto-viewer" aria-label={`${alt} 크게 보기`} onPointerDown={event => event.stopPropagation()} onPointerMove={event => event.stopPropagation()} onPointerUp={event => event.stopPropagation()} onPointerCancel={event => event.stopPropagation()} onClick={event => event.stopPropagation()} onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={event => {
    event.stopPropagation();
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); change(event.key === "ArrowLeft" ? -1 : 1); }
    if (event.key === "+" || event.key === "=") { event.preventDefault(); adjustZoom(1); }
    if (event.key === "-") { event.preventDefault(); adjustZoom(-1); }
  }}>
    <button className="viewer-close" type="button" onClick={onClose} autoFocus aria-label="확대 이미지 닫기">×</button>
    <div className={`viewer-stage${arrowsHidden ? " viewer-arrows-hidden" : ""}`}>
      <button className="viewer-previous" type="button" disabled={images.length < 2} onClick={() => change(-1)} aria-label="이전 작품">&lt;</button>
      <figure className="viewer-artwork" key={index}>
        <div ref={viewerWindow} className={`viewer-window${zoom > 1 ? " is-zoomed" : ""}${panning ? " is-panning" : ""}`} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onDragStart={event => event.preventDefault()}>
          <div className="viewer-zoom-surface" style={{ transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${zoom})` }}><ViewerVisual image={image} alt={alt} /></div>
        </div>
        <div className="viewer-controls-row"><div className="viewer-zoom-controls" aria-label="이미지 확대 조절">
          <button type="button" onClick={() => adjustZoom(-1)} disabled={zoom <= 1} aria-label="이미지 축소">−</button>
          <output aria-live="polite">{Math.round(zoom * 100)}%</output>
          <button type="button" onClick={() => adjustZoom(1)} disabled={zoom >= 5} aria-label="이미지 확대">+</button>
        </div></div>
        <figcaption aria-live="polite"><p className="viewer-index">{String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</p>{caption.map((line, i) => <p key={i}>{line}</p>)}{contact && <div className="viewer-contact">{contact}</div>}</figcaption>
      </figure>
      <button className="viewer-next" type="button" disabled={images.length < 2} onClick={() => change(1)} aria-label="다음 작품">&gt;</button>
    </div>
  </dialog>, document.body);
}

export function ArtworkViewer({ src, fullSrc, alt, className = "", href, magnifier = true, images, initialIndex = 0, contact, onSwipe, swipeThreshold = 18, children }: { src: string | null; fullSrc?: string; alt: string; className?: string; href?: string; magnifier?: boolean; images?: ArtworkSlide[]; initialIndex?: number; contact?: ReactNode; onSwipe?: (direction: number) => void; swipeThreshold?: number; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [lens, setLens] = useState<{x: number; y: number; width: number; height: number; px: number; py: number} | null>(null);
  const swipe = useImageSwipe(onSwipe ? direction => { setLens(null); onSwipe(direction); } : undefined, swipeThreshold);
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
    ...swipe.handlers,
    onPointerMove: (event: PointerEvent<HTMLElement>) => { swipe.handlers.onPointerMove(event); move(event); },
    onPointerLeave: () => setLens(null),
    onDragStart: (event: React.DragEvent) => event.preventDefault(),
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      if (swipe.suppressClick.current) { event.preventDefault(); swipe.suppressClick.current = false; return; }
      if (href) return;
      event.preventDefault(); if (src) { setLens(null); setOpen(true); }
    },
  };
  return <>{href ? <Link {...props} href={href} aria-label={`${alt} 전시 상세 보기`}>{content}</Link> : <button {...props} type="button" disabled={!src} aria-label={`${alt} 크게 보기`}>{content}</button>}{open && src && <ArtworkLightbox images={images?.length ? images : [{ src, fullSrc, title: alt }]} initialIndex={initialIndex} alt={alt} contact={contact} onClose={() => setOpen(false)} />}</>;
}
