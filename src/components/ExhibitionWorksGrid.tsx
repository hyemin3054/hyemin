import { ArtworkViewer, type ArtworkSlide } from "./ArtworkViewer";

const captionLine = (...values: (string | null | undefined)[]) => values.map(value => value?.trim()).filter(Boolean).join(", ");

export function ExhibitionWorksGrid({ images, exhibitionTitle }: { images: ArtworkSlide[]; exhibitionTitle: string }) {
  if (!images.length) return null;
  return <section className="ex-detail-works" aria-labelledby="exhibition-works-title">
    <h2 id="exhibition-works-title">WORKS</h2>
    <div className="ex-detail-works-grid">{images.map((image, index) => {
      const firstLine = captionLine(image.title, image.year);
      const secondLine = captionLine(image.medium, image.size);
      const alt = image.title || `${exhibitionTitle} 작품 ${index + 1}`;
      return <figure key={`${image.src}-${index}`}>
        <div className="ex-detail-work-image"><ArtworkViewer src={image.src} fullSrc={image.fullSrc} alt={alt} images={images} initialIndex={index} /></div>
        {(firstLine || secondLine) && <figcaption>{firstLine && <p>{firstLine}</p>}{secondLine && <p>{secondLine}</p>}</figcaption>}
      </figure>;
    })}</div>
  </section>;
}
