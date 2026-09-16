// All queries use the published perspective AND exclude non-published IDs.
export const publishedFilter = '!(_id in path("drafts.**")) && !(_id in path("versions.**"))';
const contentFilter = `${publishedFilter} && _type == $type && defined(slug.current)`;
const projection = `{
  _id, _type, "title": coalesce(name, title, "제목 준비 중"), "slug": slug.current,
  name, shortBio, fullBio, portrait, representativeImage, representativeImageDescription,
  "works": coalesce(works, []), "selectedExhibitions": coalesce(selectedExhibitions, []),
  "education": coalesce(education, []), "awards": coalesce(awards, []),
  "artist": artist->{_id, name, "slug": slug.current},
  startDate, endDate, mainImage, "galleryImages": coalesce(galleryImages, []),
  shortDescription, description, status, date, excerpt, body,
  "detailImages": coalesce(detailImages, galleryImages, [])[0...5],
  year, medium, dimensions, price, availability, displayOrder
}`;
export const listQuery = `*[${contentFilter}] | order(coalesce(displayOrder, 100) asc, date desc, startDate desc, _id asc) ${projection}`;
export const detailQuery = `*[${contentFilter} && slug.current == $slug][0] ${projection}`;
export const settingsQuery = `*[_type == "siteSettings" && _id == "siteSettings" && ${publishedFilter}][0]{
  logo, address, openingHours, telephone, email, instagram, copyright,
  aboutText, "aboutImages": coalesce(aboutImages, []), mapInformation
}`;
export const healthQuery = `{
  "artists": count(*[_type == "artist" && ${publishedFilter}]),
  "exhibitions": count(*[_type == "exhibition" && ${publishedFilter}]),
  "news": count(*[_type == "news" && ${publishedFilter}]),
  "salesArtworks": count(*[_type == "salesArtwork" && ${publishedFilter}]),
  "siteSettings": count(*[_type == "siteSettings" && _id == "siteSettings"])
}`;
