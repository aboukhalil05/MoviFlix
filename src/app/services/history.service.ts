import { Injectable, signal } from '@angular/core';
import { Movie } from '../models/movie.model';

export interface HistoryItem {
  imdbID: string;
  title: string;
  poster: string;
  visitedAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private readonly STORAGE_KEY = 'moviflix_history';
  public history = signal<HistoryItem[]>([]);

  constructor() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.history.set(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }

  addToHistory(movie: Movie): void {
    this.history.update(current => {
      // Remove if exists to prevent duplicates and update timestamp
      let filtered = current.filter(item => item.imdbID !== movie.imdbID);
      
      const newItem: HistoryItem = {
        imdbID: movie.imdbID,
        title: movie.Title,
        poster: movie.Poster,
        visitedAt: Date.now()
      };
      
      // Add to beginning
      filtered.unshift(newItem);
      
      // Keep only max 8 entries
      const result = filtered.slice(0, 8);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(result));
      return result;
    });
  }

  clearHistory(): void {
    this.history.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
