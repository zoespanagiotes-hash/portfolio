import { Injectable } from '@angular/core';

const STORAGE_KEY = 'theme';
export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  current: Theme = 'dark';

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved) {
      this.current = saved;
      this.apply(this.current);
    } else {
      // default to system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.current = prefersDark ? 'dark' : 'light';
      this.apply(this.current);
    }
  }

  toggle() {
    this.current = this.current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, this.current);
    this.apply(this.current);
  }

  apply(theme: Theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
