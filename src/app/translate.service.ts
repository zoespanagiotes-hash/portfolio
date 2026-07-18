import { Injectable, signal } from '@angular/core';

type Lang = 'en' | 'el';

type TranslateParams = Record<string, string | number | boolean>;

@Injectable({ providedIn: 'root' })
export class TranslateService {
  readonly language = signal<Lang>('en');
  readonly translations = signal<Record<Lang, Record<string, unknown>>>({} as Record<Lang, Record<string, unknown>>);

  constructor() {
    this.loadLanguage(this.language());
  }

  async setLanguage(lang: Lang): Promise<void> {
    if (this.language() === lang) return;
    this.language.set(lang);
    localStorage.setItem('preferredLanguage', lang);
    await this.loadLanguage(lang);
  }

  async loadLanguage(lang: Lang): Promise<void> {
    if (this.translations()[lang]) {
      return;
    }

    try {
      const response = await fetch(`/i18n/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load translations: ${response.status}`);
      }

      const data = await response.json();
      this.translations.update((current) => ({
        ...current,
        [lang]: data,
      }));
    } catch (error) {
      console.error('[TranslateService] Failed to load translations', error);
    }
  }

  translate(key: string, params?: TranslateParams): string {
    const lang = this.language();
    const translations = this.translations()[lang] as Record<string, unknown> | undefined;
    if (!translations) {
      return key;
    }

    const path = key.split('.');
    let current: unknown = translations;

    for (const segment of path) {
      if (typeof current !== 'object' || current === null) {
        return key;
      }

      const next = (current as Record<string, unknown>)[segment];
      if (next === undefined) {
        return key;
      }
      current = next;
    }

    if (typeof current !== 'string') {
      return key;
    }

    return this.interpolate(current, params);
  }

  private interpolate(value: string, params?: TranslateParams): string {
    if (!params) {
      return value;
    }

    return value.replace(/{([^}]+)}/g, (match, paramName) => {
      const replacement = params[paramName];
      return replacement === undefined ? match : String(replacement);
    });
  }
}
