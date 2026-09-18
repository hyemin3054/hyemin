"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageDissolve } from "./ImageDissolve";

type Artist = { id: string; name: string; slug: string; image: string | null };

function ArtistImage({ artist }: { artist: Artist }) {
  const [failed, setFailed] = useState(false);
  return <div className="artists-image">
    {artist.image && !failed
      ? <img src={artist.image} alt={`${artist.name} 대표 이미지`} onError={() => setFailed(true)} />
      : <p className="muted">이미지 준비 중</p>}
  </div>;
}

export function ArtistsList({ artists }: { artists: Artist[] }) {
  const [selectedId, setSelectedId] = useState(artists[0]?.id);
  const selected = artists.find((artist) => artist.id === selectedId) || artists[0];
  if (!selected) return null;
  return <div className="artists-layout">
    <ul className="artists-names" aria-label="작가 목록">
      {artists.map((artist) => <li key={artist.id}>
        <Link href={`/artists/${encodeURIComponent(artist.slug)}`}
          className="artists-name" data-selected={artist.id === selected.id}
          onMouseEnter={() => setSelectedId(artist.id)} onFocus={() => setSelectedId(artist.id)}>
          <span>{artist.name}</span><span className="artists-arrow" aria-hidden="true">&gt;</span>
        </Link>
        <div className="artists-mobile-image"><ArtistImage key={artist.image} artist={artist} /></div>
      </li>)}
    </ul>
    <figure className="artists-preview">
      <ImageDissolve imageKey={`${selected.id}-${selected.image}`} src={selected.image}>
        <ArtistImage key={`${selected.id}-${selected.image}`} artist={selected} />
      </ImageDissolve>
      <figcaption>{selected.name}</figcaption>
    </figure>
  </div>;
}
