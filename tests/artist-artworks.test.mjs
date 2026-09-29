import test from 'node:test';
import assert from 'node:assert/strict';
import { artistArtworks, artworkCaption } from '../src/lib/artist-artworks.ts';
test('main artwork is excluded from every additional source without mutating CMS data', () => {
 const image = {asset:{_ref:'image-main'}};
 const artist = {portfolioImages:[image], representativeImage:image, works:[{image,title:'Main'},{image:{asset:{_ref:'image-other'}},title:'Other'}]};
 const before = JSON.stringify(artist);
 const result = artistArtworks(artist);
 assert.equal(result.additional.length,1);
 assert.equal(result.additional[0].title,'Other');
 assert.equal(result.mainWork.title,'Main');
 assert.equal(JSON.stringify(artist),before);
});
test('captions skip empty separators and absent artwork is safe', () => {
 assert.deepEqual(artworkCaption({title:'  Work ', year:'', medium:'Oil',size:'90 cm'}), ['Work','Oil / 90 cm']);
 assert.deepEqual(artworkCaption(),[]);
 assert.deepEqual(artistArtworks({}).additional,[]);
});

test('one representative is shared, with legacy fallbacks and no data mutation', () => {
 const representativeImage={asset:{_ref:'rep'}};
 const portfolio={asset:{_ref:'portfolio'}};
 const portrait={asset:{_ref:'portrait'}};
 assert.equal(artistArtworks({representativeImage,portfolioImages:[portfolio],portrait}).main,representativeImage);
 assert.equal(artistArtworks({portfolioImages:[portfolio],portrait}).main,portfolio);
 assert.equal(artistArtworks({portrait}).main,portrait);
 assert.equal(artistArtworks({works:[{image:portfolio}]}).main,portfolio);
 assert.equal(artistArtworks({representativeImage,portfolioImages:[portfolio]}).additional[0].image,portfolio);
});
