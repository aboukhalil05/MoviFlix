import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'moviflix_theme';

  /** Reactive signal — true = dark mode */
  isDark = signal<boolean>(this.getInitialTheme());

  constructor() {
    // Apply theme from signal whenever it changes
    effect(() => {
      this.applyTheme(this.isDark());
    });
  }

  /** Toggle between dark and light */
  toggle(): void {
    this.isDark.update(v => !v);
    localStorage.setItem(this.STORAGE_KEY, this.isDark() ? 'dark' : 'light');
  }

  private getInitialTheme(): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) return stored === 'dark';
    // Respect OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(dark: boolean): void {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}
