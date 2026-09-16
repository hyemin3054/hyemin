import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse, evaluate } from 'groq-js';

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'piw08hz1';
process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';

async function main() {
  const { ContentBody, ContentCard, HistoryList } = await import('../src/components/CmsFields');
  const { listQuery, detailQuery, settingsQuery } = await import('../src/sanity/lib/queries');
  const image = { asset: { _ref: 'image-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-100x100-png' } };
  const rich = [{ _type: 'block', _key: 'b', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's', text: 'Rich body content', marks: [] }] }];
  const history = [{ _key: 'empty' }, { _key: 'h', year: '2026', description: 'History content' }];
  const base = { _id: 'fixture', title: 'Fixture', slug: { current: 'fixture' }, featured: true, displayOrder: 2 };
  const artist = { ...base, _id: 'artist', _type: 'artist', name: 'Artist name', shortBio: 'Short biography', fullBio: rich, portrait: image, representativeImage: image, selectedExhibitions: history, education: history, awards: history, works: [{ _key: 'empty' }, { _key: 'work', title: 'Work title', year: '1999', description: 'Work description', image }] };
  const exhibition = { ...base, _id: 'exhibition', _type: 'exhibition', artist: { _ref: 'artist' }, startDate: '2026-01-01', endDate: '2026-02-01', mainImage: image, galleryImages: [image], shortDescription: 'Exhibition summary', description: rich, status: 'current' };
  const news = { ...base, _id: 'news', _type: 'news', date: '2026-03-01', mainImage: image, galleryImages: [image], excerpt: 'News excerpt', body: rich };
  const sales = { ...base, _id: 'sales', _type: 'salesArtwork', artist: { _ref: 'artist' }, year: '2000', mainImage: image, medium: 'Oil on canvas', dimensions: '20 × 30 cm', price: 0, availability: 'available', description: rich };
  const settings = { _id: 'siteSettings', _type: 'siteSettings', logo: image, address: 'Address', openingHours: 'Hours', telephone: '123', email: 'test@example.com', instagram: 'https://instagram.com/example', copyright: 'Copyright', aboutText: rich, aboutImages: [image], mapInformation: { location: { lat: 0, lng: 0 }, directions: 'Directions', mapUrl: 'https://example.com/map' } };
  const dataset = [artist, exhibition, news, sales, settings, { ...artist, _id: 'drafts.only', slug: { current: 'draft-only' } }, { ...artist, _id: 'versions.release.only' }];
  async function query(q: string, params = {}) { return (await evaluate(parse(q), { dataset, params })).get(); }
  for (const source of [artist, exhibition, news, sales]) {
    const item = await query(detailQuery, { type: source._type, slug: 'fixture' });
    for (const field of Object.keys(source)) {
      if (field === 'slug') assert.equal(item.slug, 'fixture');
      else if (field === 'title' && source._type === 'artist') assert.equal(item.title, 'Artist name');
      else if (field === 'featured') assert.equal(item.featured, undefined);
      else if (field === 'artist') assert.equal(item.artist.name, 'Artist name');
      else assert.deepEqual(item[field], (source as any)[field], `${source._type}.${field}`);
    }
    const html = renderToStaticMarkup(<><ContentBody item={item} /><ul><ContentCard item={item} basePath='/test' /></ul></>);
    const detailHtml = renderToStaticMarkup(<ContentBody item={item} />);
    const cardHtml = renderToStaticMarkup(<ul><ContentCard item={item} basePath='/test' /></ul>);
    if (source._type === 'salesArtwork') {
      assert.equal((detailHtml.match(/<img /g) || []).length, 1);
      assert.equal((cardHtml.match(/<img /g) || []).length, 1);
    }
    if (source._type === 'salesArtwork') {
      for (const hidden of ['2000', 'Oil on canvas', '20 × 30 cm', '구매 가능', 'Rich body content', '주요 콘텐츠']) assert.ok(!cardHtml.includes(hidden), hidden);
      for (const visible of ['Fixture', 'Artist name', '0원']) assert.ok(cardHtml.includes(visible), visible);
    }
    for (const value of ['Rich body content']) assert.ok(html.includes(value), `${source._type}: ${value}`);
    const expected = source._type === 'artist' ? ['주요 전시 이력', '학력', '수상 내역', 'History content', 'Work title', '1999', 'Work description', 'Short biography']
      : source._type === 'exhibition' ? ['2026-01-01', '2026-02-01', '현재 전시', 'Artist name', 'Exhibition summary']
      : source._type === 'news' ? ['2026-03-01', 'News excerpt'] : ['2000', 'Oil on canvas', '20 × 30 cm', '0원', '구매 가능', 'Artist name'];
    for (const value of expected) assert.ok(html.includes(value), value);
    const emptyHtml = renderToStaticMarkup(<ContentBody item={{ _id: 'empty', _type: source._type as any, title: 'Empty', slug: 'empty', works: [{} as any], education: [{} as any], galleryImages: [null as any] }} />);
    assert.ok(!emptyHtml.includes('<li') && !emptyHtml.includes('<img') && !emptyHtml.includes('undefined'));
  }
  assert.equal((await query(detailQuery, {type:'news', slug:'fixture'})).detailImages.length, 1);
  Object.assign(news, { detailImages: Array.from({length: 7}, (_, i) => ({...image, _key: String(i)})) });
  assert.equal((await query(detailQuery, {type:'news', slug:'fixture'})).detailImages.length, 5);
  Object.assign(news, { detailImages: [] });
  assert.deepEqual((await query(detailQuery, {type:'news', slug:'fixture'})).detailImages, []);
  const settingsResult = await query(settingsQuery);
  for (const key of Object.keys(settings).filter(k => !k.startsWith('_'))) assert.deepEqual(settingsResult[key], (settings as any)[key], key);
  const artists = await query(listQuery, { type: 'artist' });
  assert.equal(artists.length, 1);
  assert.equal(await query(detailQuery, { type: 'artist', slug: 'draft-only' }), null);
  assert.equal(renderToStaticMarkup(<HistoryList title='학력' entries={[{ _key: 'empty', description: '   ' }]} />), '');
  for (const [availability, label] of [['reserved','예약됨'], ['sold','판매 완료']]) {
    assert.ok(renderToStaticMarkup(<ContentBody item={{ _id:'s', _type:'salesArtwork', title:'S', slug:'s', availability: availability as any }} />).includes(label));
  }
  console.log('PASS: all schema fixture fields survive GROQ; four content renderers; settings projection; references; dates/status; zero price; image roles; empty entries; drafts/releases excluded.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
