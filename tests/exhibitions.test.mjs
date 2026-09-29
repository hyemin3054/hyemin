import test from "node:test";
import assert from "node:assert/strict";
import { groupExhibitions, galleryDate } from "../src/lib/exhibitions.ts";
import { exhibitionImages } from "../src/lib/exhibition-images.ts";
const entry = (id, fields = {}) => ({ _id: id, _type: "exhibition", title: id, slug: id, ...fields });

test("end dates are inclusive in Korean time, and stale status cannot keep ended exhibitions current", () => {
  const data = [entry("current", { status: "current", startDate: "2026-09-01", endDate: "2026-09-26" }), entry("past", { status: "current", endDate: "2026-09-25" }), entry("old", { status: "archive", endDate: "2025-12-01", displayOrder: 0 }), entry("future", { status: "upcoming", startDate: "2026-10-01", endDate: "2026-11-01" })];
  const groups = groupExhibitions(data, "2026-09-26");
  assert.deepEqual(groups.current.map(x => x._id), ["current"]);
  assert.equal(groups.past._id, "past");
  assert.deepEqual(groups.archive.map(x => x._id), ["old"]);
  assert.equal(groupExhibitions(data, "2026-09-27").past._id, "current");
  assert.equal(galleryDate(new Date("2026-09-25T15:00:00Z")), "2026-09-26");
});
test("dated ongoing exhibitions and legacy undated documents remain supported", () => {
  const groups = groupExhibitions([entry("ongoing", { status: "upcoming", startDate: "2026-09-01", endDate: "2026-10-01" }), entry("legacy", { status: "archive" })], "2026-09-26");
  assert.equal(groups.current[0]._id, "ongoing");
  assert.equal(groups.past._id, "legacy");
  assert.deepEqual(groupExhibitions([]), { current: [], past: null, archive: [] });
});
test("image deduplication preserves caption, order and original data", () => {
  const main = { asset: { _ref: "image-one" } };
  const gallery = [{ ...main, title: "Artwork", year: "2026" }, { asset: { _ref: "image-two" } }, {}];
  const result = exhibitionImages(main, gallery);
  assert.equal(result.length, 2);
  assert.equal(result[0].title, "Artwork");
  assert.equal(result[1].asset._ref, "image-two");
  assert.equal(main.title, undefined);
  assert.deepEqual(exhibitionImages(null, []), []);
});
