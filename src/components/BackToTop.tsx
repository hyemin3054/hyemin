"use client";

export function BackToTop() {
  return <button type="button" className="footer-back-to-top" onClick={() => {
    window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }}>Back to Top ↑</button>;
}
