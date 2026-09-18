"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Enhance the existing document without taking ownership of navigation or layout.
export function SiteMotion() {
  const pathname = usePathname();
  const entered = useRef(false);
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    const measure = () => document.documentElement.style.setProperty("--sticky-header-height", `${header.getBoundingClientRect().height}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => { observer.disconnect(); document.documentElement.style.removeProperty("--sticky-header-height"); };
  }, []);

  useEffect(() => {
    const main = document.querySelector<HTMLElement>(".site-main");
    if (!main) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const animate = (element: Element, frames: Keyframe[], duration: number) => {
      if (reduced.matches || !element.animate) return;
      const animation = element.animate(frames, { duration, easing: "cubic-bezier(.2,.65,.3,1)" });
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };
    if (!entered.current || !("startViewTransition" in document)) {
      animate(main, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }], 450);
    }
    entered.current = true;
    // Offscreen sections stay readable even when JS or an observer is unavailable.
    const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animate(entry.target, [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }], 500);
        observer?.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" }) : null;
    main.querySelectorAll("section").forEach(section => {
      const parentSection = section.parentElement?.closest("section");
      if ((!parentSection || parentSection.parentElement === main) && section.getBoundingClientRect().top > window.innerHeight) observer?.observe(section);
    });
    const stop = () => { if (reduced.matches) animations.forEach(animation => animation.cancel()); };
    reduced.addEventListener("change", stop);
    return () => { observer?.disconnect(); animations.forEach(animation => animation.cancel()); reduced.removeEventListener("change", stop); };
  }, [pathname]);
  return null;
}
