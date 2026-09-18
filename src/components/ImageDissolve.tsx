"use client";

import { useEffect, useState, type ReactNode } from "react";

type Frame = { id: string; content: ReactNode };

export function ImageDissolve({ imageKey, src, children }: { imageKey: string; src: string | null; children: ReactNode }) {
  const [current, setCurrent] = useState<Frame>({ id: imageKey, content: children });
  const [previous, setPrevious] = useState<Frame | null>(null);
  useEffect(() => {
    if (imageKey === current.id) return;
    let cancelled = false;
    const show = () => {
      if (cancelled) return;
      setPrevious(current);
      setCurrent({ id: imageKey, content: children });
    };
    if (src) {
      const image = new Image();
      image.src = src;
      image.decode().then(show, show);
    } else show();
    return () => { cancelled = true; };
  }, [imageKey, src, children, current]);
  // Keep retirement independent of the next pending image download, including
  // quick A → B → A selections while B is still loading.
  useEffect(() => {
    const timer = setTimeout(() => setPrevious(null), 320);
    return () => clearTimeout(timer);
  }, [current]);
  return <div className="image-dissolve">
    {previous && <div className="image-dissolve-old" aria-hidden="true">{previous.content}</div>}
    <div key={current.id} className={previous ? "image-dissolve-new" : "image-dissolve-current"}>{current.content}</div>
  </div>;
}
