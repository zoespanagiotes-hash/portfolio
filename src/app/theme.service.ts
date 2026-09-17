import { Injectable } from '@angular/core';

const STORAGE_KEY = 'theme';
export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  current: Theme = 'dark';

  constructor() {
    // dark is the default regardless of system preference — only an
    // explicit, previously saved choice switches to light
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    this.current = saved ?? 'dark';
    this.apply(this.current);
  }

  toggle() {
    this.current = this.current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, this.current);
    this.apply(this.current);
  }

  apply(theme: Theme) {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }
}
