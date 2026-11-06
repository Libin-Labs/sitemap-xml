# @lp-labs/sitemap-xml

Minimal XML sitemap URL-set writer and reader with safe XML entity handling.

Original, standalone MIT TypeScript implementation with **zero runtime or peer dependencies**. ESM/CommonJS exports and separate declarations; Node18+ and compatible ES2022 browsers. No service, filesystem, network, clock or browser globals accessed on import. Compiler/formatter dependencies are development-only.

## Install

```sh
npm install @lp-labs/sitemap-xml
```

## Working example

```js
import { writeSitemap, readSitemap } from '@lp-labs/sitemap-xml';
const xml = writeSitemap(['https://example.com/', 'https://example.com/a?x=1&y=2']);
if (readSitemap(xml).length !== 2) throw new Error('Sitemap round trip failed');
```

CommonJS: `const api = require('@lp-labs/sitemap-xml')`.

## Behavior, customization and limits

Reads and writes URL-set documents containing loc elements only, with the standard sitemap namespace. It escapes XML text and accepts the five predefined entities; it does not fetch, validate URL reachability, parse extensions, or support arbitrary XML.

Use the explicit function arguments and public types below to customize the documented behavior. There are no hidden environment settings or sibling-library requirements. Array inputs must be dense; sparse entries are invalid. Inputs are validated before a successful result is returned. Outputs do not mutate caller-owned inputs. Hostile proxies/getters and concurrent mutation are outside the contract.

## Errors and integration

Invalid data never produces an empty success-shaped substitute. TypeError reports incompatible runtime types/nonfinite numbers; RangeError reports unsupported ranges, invalid syntax, inconsistent states and exceeded budgets. Functions that explicitly return null, false or empty arrays describe those legitimate outcomes above. Errors propagate to callers; UI applications should catch at their boundary and visibly notify users. Numerical calculations use JavaScript IEEE754 unless the API explicitly uses bigint; compare approximate numerical results with application-appropriate tolerances.

## Complete public API

```ts
export declare function writeSitemap(urls: readonly string[]): string;
export declare function readSitemap(xml: string): string[];
```

## Performance and portability

Complexity and resource ceilings are specified above. Buffered synchronous algorithms do not create workers or timers; callers can move expensive work to their own worker. Limits are enforced, not silently truncated. No runtime imports from any other library. No compatibility or completeness claims beyond the stated scope.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
