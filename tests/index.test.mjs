import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('round trips ordinary locations', () => {
  const urls = ['https://example.com/', 'https://example.org/a'];
  assert.deepEqual(api.readSitemap(api.writeSitemap(urls)), urls);
});
test('escapes ampersands and angle brackets', () => {
  const x = 'https://example.com/?a=1&b=2';
  assert.ok(api.writeSitemap([x]).includes('&amp;'));
  assert.deepEqual(api.readSitemap(api.writeSitemap([x])), [x]);
});
test('handles empty url set', () => {
  assert.deepEqual(api.readSitemap(api.writeSitemap([])), []);
});
test('rejects non-http schemes', () => {
  assert.throws(() => api.writeSitemap(['file:///etc/passwd']), TypeError);
});
test('rejects entity declarations', () => {
  assert.throws(
    () =>
      api.readSitemap(
        '<!DOCTYPE x><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
      ),
    TypeError,
  );
});
test('rejects unsupported elements', () => {
  assert.throws(
    () =>
      api.readSitemap(
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://x.test</loc><lastmod>2020</lastmod></url></urlset>',
      ),
    TypeError,
  );
});
