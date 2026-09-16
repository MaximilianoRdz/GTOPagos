import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'theme';

  initTheme() {
    const savedTheme = localStorage.getItem(this.storageKey) as Theme | null;
    this.applyTheme(savedTheme ?? 'auto');
  }

  setTheme(theme: Theme) {
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }

  getTheme(): Theme {
    return (localStorage.getItem(this.storageKey) as Theme) ?? 'auto';
  }

  private applyTheme(theme: Theme) {
    const html = document.documentElement;

    if (theme === 'dark') {
      html.classList.add('dark');
    } else if (theme === 'light') {
      html.classList.remove('dark');
    } else {
      // auto
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.classList.toggle('dark', prefersDark);
    }
  }
}
