import * as api from '@lp-labs/sitemap-xml';
import { writeSitemap, readSitemap } from '@lp-labs/sitemap-xml';
const xml = writeSitemap(['https://example.com/', 'https://example.com/a?x=1&y=2']);
if (readSitemap(xml).length !== 2) throw new Error('Sitemap round trip failed');
// @ts-expect-error invalid argument must be rejected by declarations
api.writeSitemap(4);
