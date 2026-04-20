import { Injectable, signal } from '@angular/core';
import { MovieSearchResult } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly storageKey = 'moviflix_favorites';
  private readonly legacyStorageKey = 'cinesearch_favorites';
  private readonly favoritesSignal = signal<MovieSearchResult[]>(this.loadFromStorage());

  readonly favorites = this.favoritesSignal.asReadonly();

  add(movie: MovieSearchResult): void {
    const favorites = this.favoritesSignal();
    if (favorites.some(item => item.imdbID === movie.imdbID)) return;

    const updated = [...favorites, movie];
    this.favoritesSignal.set(updated);
    this.persist(updated);
  }

  remove(imdbID: string): void {
    const updated = this.favoritesSignal().filter(movie => movie.imdbID !== imdbID);
    this.favoritesSignal.set(updated);
    this.persist(updated);
  }

  isFavorite(imdbID: string): boolean {
    return this.favoritesSignal().some(movie => movie.imdbID === imdbID);
  }

  getAll(): MovieSearchResult[] {
    return this.favoritesSignal();
  }

  private loadFromStorage(): MovieSearchResult[] {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    const legacyRaw = localStorage.getItem(this.legacyStorageKey);
    if (!legacyRaw) return [];

    try {
      const legacyParsed = JSON.parse(legacyRaw);
      if (!Array.isArray(legacyParsed)) return [];
      localStorage.setItem(this.storageKey, JSON.stringify(legacyParsed));
      localStorage.removeItem(this.legacyStorageKey);
      return legacyParsed;
    } catch {
      return [];
    }
  }

  private persist(favorites: MovieSearchResult[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }
}
