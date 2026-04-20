import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'moviflix_theme';
  private readonly isDarkSignal = signal<boolean>(this.getInitialTheme());

  /** Reactive signal — true = dark mode */
  readonly isDark = this.isDarkSignal.asReadonly();

  constructor() {
    // Apply + persist theme whenever signal changes
    effect(() => {
      const dark = this.isDarkSignal();
      this.applyTheme(dark);
      localStorage.setItem(this.STORAGE_KEY, dark ? 'dark' : 'light');
    });
  }

  /** Toggle between dark and light */
  toggle(): void {
    this.isDarkSignal.update(v => !v);
  }

  private getInitialTheme(): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) return stored === 'dark';
    // Respect OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(dark: boolean): void {
    const html = document.documentElement;
    const body = document.body;
    if (dark) {
      html.classList.add('dark');
      body.classList.add('dark');
    } else {
      html.classList.remove('dark');
      body.classList.remove('dark');
    }
  }
}
