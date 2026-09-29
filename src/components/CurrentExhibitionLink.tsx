"use client";

export function CurrentExhibitionLink() {
  return <a className="home-current-anchor" href="#current-exhibition" onClick={event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const section = document.getElementById("current-exhibition");
    if (!section) return;
    event.preventDefault();
    const gallery = section.querySelector(".exhibition-viewer") || section;
    const header = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
    const rect = gallery.getBoundingClientRect();
    const landing = Math.max(header + 24, header + (window.innerHeight - header - rect.height) / 2);
    window.history.pushState(null, "", "#current-exhibition");
    window.scrollTo({ top: Math.max(0, window.scrollY + rect.top - landing), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }}>↓<br />CURRENT EXHIBITION</a>;
}
