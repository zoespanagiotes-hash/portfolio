// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TranslateService } from './translate.service';

describe('TranslateService', () => {
  let service: TranslateService;
  let baseElement: HTMLBaseElement | null;

  beforeEach(() => {
    service = new TranslateService();
  });

  afterEach(() => {
    if (baseElement) {
      document.head.removeChild(baseElement);
      baseElement = null;
    }
    vi.restoreAllMocks();
  });

  it('loads translations from the app base path', async () => {
    baseElement = document.createElement('base');
    baseElement.href = '/portfolio/';
    document.head.appendChild(baseElement);

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ hello: 'bonjour' }),
    });

    vi.stubGlobal('fetch', fetchMock);

    await service.loadLanguage('en');

    const expectedUrl = new URL('i18n/en.json', new URL('/portfolio/', window.location.origin).toString()).toString();
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl);
  });
});
