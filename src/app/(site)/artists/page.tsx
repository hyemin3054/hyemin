import { ArtistsList } from "@/components/ArtistsList";
import { Divider } from "@/components/Divider";
import { getContentList } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";
import "@/styles/artists.css";

export const metadata = { title: "Artists" };
export default async function Page() {
  const result = await getContentList("artist");
  return <section className="container artists-page">
    <p className="artists-eyebrow">Artists</p>
    <h1>Artists</h1>
    <Divider />
    {result.status !== "ready" ? <p className="artists-message">콘텐츠를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p>
      : result.data.length ? <ArtistsList artists={result.data.map((artist) => ({
        id: artist._id, name: artist.name || artist.title, slug: artist.slug,
        image: imageUrl(artist.representativeImage, 1200),
      }))} /> : <p className="artists-message">등록된 작가가 없습니다.</p>}
  </section>;
}
