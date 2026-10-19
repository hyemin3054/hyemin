"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import "@/styles/mobile-image-rail.css";

export function useMobileGallery() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const media = matchMedia("(max-width: 800px)");
    const update = () => setMobile(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return mobile;
}

// A single pointer gesture moves the whole strip; no second fade or swipe timer.
export function MobileImageRail({ count, active, onSelect, renderSlide, label }: {
  count: number; active: number; onSelect: (index: number) => void;
  renderSlide: (index: number, current: boolean) => ReactNode; label: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);
  const start = useRef<{ id: number; x: number; y: number; time: number; horizontal: boolean } | null>(null);
  const suppress = useRef(false);
  const [drag, setDrag] = useState(0);
  useEffect(() => () => { animation.current?.cancel(); }, []);
  const move = (direction: number) => {
    const step = (track.current?.querySelector<HTMLElement>('[data-position="0"]')?.offsetWidth || 0) + 8;
    onSelect((active + direction + count) % count);
    setDrag(0);
    animation.current?.cancel();
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animation.current = track.current?.animate([
        { transform: `translateX(${drag + direction * step}px)` },
        { transform: "translateX(0)" },
      ], { duration: 240, easing: "cubic-bezier(.2,.7,.3,1)" }) ?? null;
    }
  };
  return <div ref={frame} className="mobile-image-rail" role="group" aria-label={label}
    onDragStart={event => event.preventDefault()}
    onClickCapture={event => { if (suppress.current) { event.preventDefault(); event.stopPropagation(); } }}
    onPointerDown={event => {
      suppress.current = false;
      if (!event.isPrimary || event.button !== 0 || count < 2) return;
      animation.current?.cancel();
      start.current = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now(), horizontal: false };
    }}
    onPointerMove={event => {
      const first = start.current;
      if (!first || first.id !== event.pointerId) return;
      const dx = event.clientX - first.x, dy = event.clientY - first.y;
      if (!first.horizontal && Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { start.current = null; suppress.current = true; return; }
      if (!first.horizontal && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy) * 1.1) {
        first.horizontal = true; event.currentTarget.setPointerCapture(event.pointerId);
      }
      if (first.horizontal) { suppress.current = true; setDrag(Math.max(-event.currentTarget.clientWidth, Math.min(event.currentTarget.clientWidth, dx))); }
    }}
    onPointerUp={event => {
      const first = start.current; start.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      if (!first?.horizontal) return;
      const dx = event.clientX - first.x;
      const velocity = Math.abs(dx) / Math.max(1, performance.now() - first.time);
      if (Math.abs(dx) >= 16 || (Math.abs(dx) >= 8 && velocity > .25)) move(dx < 0 ? 1 : -1);
      else { setDrag(0); }
    }}
    onPointerCancel={() => { start.current = null; suppress.current = true; setDrag(0); }}>
    <div ref={track} className="mobile-image-track" style={{ transform: `translateX(${drag}px)` }}>
      {(count > 1 ? [-1, 0, 1] : [0]).map(offset => {
        const index = (active + offset + count) % count;
        return <div className="mobile-image-slide" data-position={offset} key={offset}>
          {offset === 0 ? renderSlide(index, true) : <button type="button" aria-label={offset < 0 ? "이전 이미지" : "다음 이미지"} onClick={() => move(offset)}>{renderSlide(index, false)}</button>}
        </div>;
      })}
    </div>
  </div>;
}
