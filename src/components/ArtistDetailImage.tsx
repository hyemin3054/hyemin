"use client";
import { ArtworkViewer, type ArtworkSlide } from "./ArtworkViewer";
export function ArtistDetailImage({ src, alt, images, initialIndex = 0 }: { src: string | null; alt: string; images?: ArtworkSlide[]; initialIndex?: number }) {
  return <ArtworkViewer src={src} alt={alt} images={images} initialIndex={initialIndex} />;
}
