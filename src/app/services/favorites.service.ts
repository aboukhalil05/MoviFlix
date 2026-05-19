import { Injectable, signal } from '@angular/core';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'moviflix_favorites';
  public favorites = signal<Movie[]>([]);

  constructor() {
    this.initFromLocalStorage();
  }

  private initFromLocalStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.favorites.set(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse favorites from local storage');
      }
    }
  }

  private persist(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites()));
  }

  addFavorite(movie: Movie): void {
    if (!this.isFavorite(movie.imdbID)) {
      this.favorites.update(favs => [...favs, movie]);
      this.persist();
    }
  }

  removeFavorite(imdbID: string): void {
    this.favorites.update(favs => favs.filter(m => m.imdbID !== imdbID));
    this.persist();
  }

  isFavorite(imdbID: string): boolean {
    return this.favorites().some(m => m.imdbID === imdbID);
  }

  getAll(): Movie[] {
    return this.favorites();
  }
  
  reorder(newOrder: Movie[]): void {
    this.favorites.set(newOrder);
    this.persist();
  }
}
