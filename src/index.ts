const ns = 'http://www.sitemaps.org/schemas/sitemap/0.9';
function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
function unescapeXml(s: string): string {
  if (/&(?!(?:amp|lt|gt|quot|apos);)/.test(s))
    throw new TypeError('Unknown or malformed XML entity');
  return s.replace(
    /&(amp|lt|gt|quot|apos);/g,
    (_, n: string) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" })[n]!,
  );
}
function validUrl(value: string): void {
  try {
    const u = new URL(value);
    if (!['http:', 'https:'].includes(u.protocol)) throw new Error();
  } catch {
    throw new TypeError('Expected an absolute HTTP(S) URL');
  }
}
export function writeSitemap(urls: readonly string[]): string {
  if (!Array.isArray(urls) || urls.length > 50000)
    throw new RangeError('URL count exceeds sitemap budget');
  for (const url of urls) {
    if (typeof url !== 'string' || url.length > 2048)
      throw new TypeError('Expected bounded URL strings');
    validUrl(url);
  }
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="' +
    ns +
    '">' +
    urls.map((u) => '<url><loc>' + escapeXml(u) + '</loc></url>').join('') +
    '</urlset>'
  );
}
export function readSitemap(xml: string): string[] {
  if (typeof xml !== 'string' || xml.length > 10_000_000)
    throw new RangeError('XML text exceeds budget');
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new TypeError('Declarations are unsupported');
  const root =
    /<urlset\s+xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']\s*>([\s\S]*)<\/urlset>\s*$/.exec(
      xml,
    );
  if (!root) throw new TypeError('Expected sitemap urlset root');
  const body = root[1]!;
  const matches = [...body.matchAll(/<url>\s*<loc>([\s\S]*?)<\/loc>\s*<\/url>/g)];
  if (body.replace(/<url>\s*<loc>[\s\S]*?<\/loc>\s*<\/url>/g, '').trim())
    throw new TypeError('Unsupported or malformed sitemap element');
  return matches.map((m) => {
    const url = unescapeXml(m[1]!.trim());
    validUrl(url);
    return url;
  });
}
