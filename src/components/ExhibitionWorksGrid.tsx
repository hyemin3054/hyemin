import { ArtworkViewer, type ArtworkSlide } from "./ArtworkViewer";

const captionLine = (...values: (string | null | undefined)[]) => values.map(value => value?.trim()).filter(Boolean).join(", ");
const protectedSize = (value?: string | null) => value?.trim().replace(/(\d)\s*[×x]\s*(\d)/gi, "$1\u00a0×\u00a0$2").replace(/(\d)\s+(cm|mm|m)\b/gi, "$1\u00a0$2");

export function ExhibitionWorksGrid({ images, exhibitionTitle }: { images: ArtworkSlide[]; exhibitionTitle: string }) {
  if (!images.length) return null;
  const viewerImages = images.map((image, index) => ({ ...image, title: image.title || `${exhibitionTitle} 작품 ${index + 1}` }));
  return <section className="ex-detail-works" aria-labelledby="exhibition-works-title">
    <h2 id="exhibition-works-title">WORKS</h2>
    <div className="ex-detail-works-grid">{viewerImages.map((image, index) => {
      const alt = image.title!;
      const firstLine = captionLine(image.title || alt, image.year);
      const secondLine = captionLine(protectedSize(image.size), image.medium);
      return <figure key={`${image.src}-${index}`}>
        <div className="ex-detail-work-image"><ArtworkViewer src={image.src} fullSrc={image.fullSrc} alt={alt} images={viewerImages} initialIndex={index} /></div>
        <figcaption><p>{firstLine}</p>{secondLine && <p>{secondLine}</p>}</figcaption>
      </figure>;
    })}</div>
  </section>;
}
