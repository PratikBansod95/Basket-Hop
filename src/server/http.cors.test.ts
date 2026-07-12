import { describe, expect, it } from 'vitest';
import { isOriginAllowed } from '../../server/cors';

describe('CORS origin allowlist', () => {
  it('allows exact origins and ignores trailing slashes', () => {
    expect(
      isOriginAllowed('https://basket-hop.vercel.app', [
        'https://basket-hop.vercel.app/',
      ]),
    ).toBe(true);
  });

  it('allows empty allowlist (reflect any origin)', () => {
    expect(isOriginAllowed('https://anything.example', [])).toBe(true);
  });

  it('supports *.vercel.app wildcards', () => {
    expect(
      isOriginAllowed('https://basket-hop.vercel.app', ['https://*.vercel.app']),
    ).toBe(true);
    expect(
      isOriginAllowed('https://basket-hop-git-main.vercel.app', ['https://*.vercel.app']),
    ).toBe(true);
    expect(isOriginAllowed('https://evil.com', ['https://*.vercel.app'])).toBe(false);
  });

  it('rejects unknown origins when allowlist is set', () => {
    expect(
      isOriginAllowed('https://other.vercel.app', ['https://basket-hop.vercel.app']),
    ).toBe(false);
  });
});
