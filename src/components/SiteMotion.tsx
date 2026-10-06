"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

// Enhance the existing document without taking ownership of navigation or layout.
export function SiteMotion() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    if (pathname !== "/artists") return;
    const page = document.querySelector<HTMLElement>(".artists-page");
    const about = document.querySelector<HTMLElement>('.site-header a[href="/about"]');
    if (!page || !about) return;
    const measure = () => page.style.setProperty("--artists-about-inset", `${Math.max(0, page.getBoundingClientRect().right - about.getBoundingClientRect().left)}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(page);
    observer.observe(about);
    window.addEventListener("resize", measure);
    document.fonts.ready.then(measure);
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [pathname]);
  useLayoutEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    const measure = () => document.documentElement.style.setProperty("--sticky-header-height", `${header.getBoundingClientRect().height}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => { observer.disconnect(); document.documentElement.style.removeProperty("--sticky-header-height"); };
  }, []);

  useLayoutEffect(() => {
    if ((pathname !== "/" && pathname !== "/exhibitions") || window.location.hash !== "#archive") return;
    // Wait for the streamed home content and its measured header before aligning.
    const align = () => {
      const archive = document.getElementById("archive");
      if (!archive) return;
      observer.disconnect();
      if (pathname === "/exhibitions") {
        const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + parseFloat(getComputedStyle(archive).scrollMarginTop);
        const requiredScroll = archive.getBoundingClientRect().top + window.scrollY - offset;
        const availableScroll = document.documentElement.scrollHeight - window.innerHeight;
        const deficit = Math.max(0, requiredScroll - availableScroll);
        if (deficit > 0) archive.style.minHeight = `${archive.getBoundingClientRect().height + deficit}px`;
      }
      archive.scrollIntoView({ block: "start", behavior: pathname === "/" ? "smooth" : "instant" });
    };
    const observer = new MutationObserver(align);
    observer.observe(document.body, { childList: true, subtree: true });
    const resize = new ResizeObserver(align);
    const archive = document.getElementById("archive");
    if (archive) resize.observe(archive);
    align();
    return () => { observer.disconnect(); resize.disconnect(); };
  }, [pathname]);

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
    // Offscreen sections stay readable even when JS or an observer is unavailable.
    const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animate(entry.target, [{ opacity: 0 }, { opacity: 1 }], 500);
        observer?.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" }) : null;
    main.querySelectorAll("img").forEach(image => {
      // Galleries own their decoded image transition. Never fade a visible
      // gallery image again when the scroll observer first sees it.
      if (image.closest(".home-hero, .exhibition-viewer--home, .artists-mobile-browser")) return;
      if (image.getBoundingClientRect().top > window.innerHeight) observer?.observe(image);
    });
    const stop = () => { if (reduced.matches) animations.forEach(animation => animation.cancel()); };
    reduced.addEventListener("change", stop);
    return () => { observer?.disconnect(); animations.forEach(animation => animation.cancel()); reduced.removeEventListener("change", stop); };
  }, [pathname]);
  useLayoutEffect(() => {
    const hero = document.querySelector<HTMLElement>(".home-hero");
    const logo = document.querySelector<HTMLElement>(".home-hero-wordmark");
    if (!hero || !logo) return;
    const measure = () => {
      const frame = hero.getBoundingClientRect(), wordmark = logo.getBoundingClientRect();
      hero.style.setProperty("--hero-gradient-top", `${wordmark.top - frame.top + wordmark.height * .2}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(hero); observer.observe(logo);
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
