"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageDissolve } from "./ImageDissolve";

type Artist = { id: string; name: string; slug: string; image: string | null; thumbnail: string | null };
function ArtistImage({ artist }: { artist: Artist }) {
 const [failed, setFailed] = useState(false);
 return <div className="artists-image">{artist.image && !failed ? <img src={artist.image} alt={`${artist.name} 대표 이미지`} onError={() => setFailed(true)} /> : <p className="muted">이미지 준비 중</p>}</div>;
}
function MobileArtists({ artists }: { artists: Artist[] }) {
 const router = useRouter();
 const [active, setActive] = useState(0);
 const rail = useRef<HTMLDivElement>(null);
 const request = useRef(0);
 const progress = useRef<HTMLDivElement>(null);
 const gestureStart = useRef(0);
 const dragged = useRef(false);
 useEffect(() => {
  const element = rail.current;
  if (!element) return;
  let timer: ReturnType<typeof setTimeout>;
  let dragging = false;
  let frame = 0;
  const updateProgress = () => {
   frame = 0;
   const width = Math.min(1, element.clientWidth / element.scrollWidth);
   const position = Math.max(0, Math.min(1, element.scrollLeft / Math.max(1, element.scrollWidth - element.clientWidth)));
   progress.current?.style.setProperty("--thumb-width", `${width * 100}%`);
   progress.current?.style.setProperty("--thumb-left", `${position * (1 - width) * 100}%`);
  };
  const resize = new ResizeObserver(updateProgress); resize.observe(element); updateProgress();
  const settle = () => {
   if (dragging) return;
   const center = element.getBoundingClientRect().left + element.clientWidth / 2;
   const cards = Array.from(element.querySelectorAll<HTMLButtonElement>("button"));
   const index = cards.reduce((best, card, i) => Math.abs(card.getBoundingClientRect().left + card.offsetWidth / 2 - center) < Math.abs(cards[best].getBoundingClientRect().left + cards[best].offsetWidth / 2 - center) ? i : best, 0);
   const version = ++request.current;
   const commit = () => { if (version === request.current) setActive(index); };
   const src = artists[index]?.image;
   if (src) { const image = new Image(); image.src = src; image.decode().then(commit, commit); } else commit();
  };
  const scrolling = () => { if (!frame) frame = requestAnimationFrame(updateProgress); ++request.current; clearTimeout(timer); timer = setTimeout(settle, 120); };
  const down = (event: PointerEvent) => { dragging = true; dragged.current = false; gestureStart.current = event.clientX; ++request.current; };
  const move = (event: PointerEvent) => { if (Math.abs(event.clientX - gestureStart.current) > 8) dragged.current = true; };
  const up = () => { dragging = false; scrolling(); };
  element.addEventListener("scroll", scrolling, { passive: true });
  element.addEventListener("scrollend", settle);
  element.addEventListener("pointerdown", down);
  element.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
  return () => { resize.disconnect(); cancelAnimationFrame(frame); ++request.current; clearTimeout(timer); element.removeEventListener("scroll", scrolling); element.removeEventListener("scrollend", settle); element.removeEventListener("pointerdown", down); element.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); };
 }, [artists]);
 const selected = artists[active];
 const centerCard = (index: number) => {
  const element = rail.current, card = element?.querySelectorAll("button")[index];
  if (!element || !card) return;
  element.scrollTo({ left: card.offsetLeft - (element.clientWidth - card.offsetWidth) / 2, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
 };
 return <div className="artists-mobile-browser">
  <Link className="artists-mobile-viewer" href={`/artists/${encodeURIComponent(selected.slug)}`} aria-label={`${selected.name} 상세 보기`}>
   <ImageDissolve imageKey={selected.id} src={selected.image}><ArtistImage key={selected.id} artist={selected} /></ImageDissolve>
  </Link>
  <div className="artists-mobile-current" aria-live="polite" aria-atomic="true"><Link href={`/artists/${encodeURIComponent(selected.slug)}`}>{selected.name}</Link><p>{String(active + 1).padStart(2, "0")} / {String(artists.length).padStart(2, "0")}</p></div>
  <div ref={rail} className="artists-rail" aria-label="작가 선택">{artists.map((artist, index) => <button type="button" key={artist.id} aria-pressed={index === active} aria-label={`${artist.name} 상세 보기`} onClick={event => { if (dragged.current) { event.preventDefault(); return; } router.push(`/artists/${encodeURIComponent(artist.slug)}`); }} onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); const next = Math.max(0, Math.min(artists.length - 1, index + (event.key === "ArrowRight" ? 1 : -1))); rail.current?.querySelectorAll("button")[next].focus({ preventScroll: true }); centerCard(next); } }}><span>{artist.name}</span>{artist.thumbnail ? <img loading="lazy" src={artist.thumbnail} alt="" /> : <span className="artists-rail-placeholder">이미지 준비 중</span>}</button>)}</div>
  <p className="artists-swipe-hint">‹ 좌우로 밀어 작가를 살펴보세요 ›</p>
  <div ref={progress} className="artists-scroll-progress" aria-hidden="true"><span /></div>
 </div>;
}
export function ArtistsList({ artists }: { artists: Artist[] }) {
 const [mobile, setMobile] = useState(false);
 const [selectedId, setSelectedId] = useState(artists[0]?.id);
 useEffect(() => { const query = matchMedia("(max-width: 800px)"); const update = () => setMobile(query.matches); update(); query.addEventListener("change", update); return () => query.removeEventListener("change", update); }, []);
 const selected = artists.find(artist => artist.id === selectedId) || artists[0];
 if (!selected) return null;
 if (mobile) return <MobileArtists artists={artists} />;
 return <div className="artists-layout"><ul className="artists-names" aria-label="작가 목록">{artists.map(artist => <li key={artist.id}><Link href={`/artists/${encodeURIComponent(artist.slug)}`} className="artists-name" data-selected={artist.id === selected.id} onMouseEnter={() => setSelectedId(artist.id)} onFocus={() => setSelectedId(artist.id)}><span>{artist.name}</span><span className="artists-arrow" aria-hidden="true">&gt;</span></Link></li>)}</ul><figure className="artists-preview"><Link className="artists-preview-link" href={`/artists/${encodeURIComponent(selected.slug)}`} aria-label={`${selected.name} 상세 보기`}><ImageDissolve imageKey={`${selected.id}-${selected.image}`} src={selected.image}><ArtistImage key={`${selected.id}-${selected.image}`} artist={selected} /></ImageDissolve></Link><figcaption><Link href={`/artists/${encodeURIComponent(selected.slug)}`}>{selected.name}</Link></figcaption></figure></div>;
}
