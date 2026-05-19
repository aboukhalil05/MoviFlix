import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'moviflix_theme';
  public isDark = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.isDark.set(stored === 'dark');
    } else {
      // Vérifier la préférence système
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDark.set(prefersDark);
    }
    this.applyTheme();
  }

  toggle(): void {
    this.isDark.update(v => !v);
    localStorage.setItem(this.STORAGE_KEY, this.isDark() ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDark()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
