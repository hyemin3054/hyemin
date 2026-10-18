"use client";

import { useEffect, useRef, type PointerEvent } from "react";

// One pointer stream avoids touch/pointer cancellation races. The browser keeps
// vertical scrolling through touch-action: pan-y; horizontal releases select once.
export function useImageSwipe(onSwipe?: (direction: number) => void, threshold = 18) {
  const start = useRef<{ id: number; x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  return {
    suppressClick,
    handlers: {
      onPointerDown(event: PointerEvent<HTMLElement>) {
        suppressClick.current = false;
        const control = (event.target as Element).closest("button, a");
        if (control && control !== event.currentTarget && !control.classList.contains("artwork-viewer")) { start.current = null; return; }
        if (!onSwipe || !event.isPrimary || event.button !== 0) { start.current = null; return; }
        start.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
      },
      onPointerMove(event: PointerEvent<HTMLElement>) {
        const first = start.current;
        if (first && Math.hypot(event.clientX - first.x, event.clientY - first.y) > 8) suppressClick.current = true;
        // Capture only a horizontal drag, so taps still reach the image link/button.
        if (first && Math.abs(event.clientX - first.x) > 8 && Math.abs(event.clientX - first.x) > Math.abs(event.clientY - first.y) * 1.15) event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerCancel() { start.current = null; suppressClick.current = true; },
      onPointerUp(event: PointerEvent<HTMLElement>) {
        const first = start.current;
        start.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        if (!first || first.id !== event.pointerId || !onSwipe) return;
        const dx = event.clientX - first.x, dy = event.clientY - first.y;
        const distance = event.pointerType === "mouse" ? 40 : threshold;
        if (Math.abs(dx) >= distance && Math.abs(dx) > Math.abs(dy) * 1.15) {
          suppressClick.current = true;
          onSwipe(dx < 0 ? 1 : -1);
        }
      },
    },
  };
}

export function useAdjacentImages(sources: string[], active: number) {
  const previous = sources[(active - 1 + sources.length) % sources.length];
  const next = sources[(active + 1) % sources.length];
  useEffect(() => {
    for (const src of new Set([previous, next])) {
      if (!src) continue;
      const image = new Image(); image.src = src;
      void image.decode().catch(() => {});
    }
  }, [previous, next]);
}
