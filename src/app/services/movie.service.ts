import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MovieDetail, MovieSearchResult, SearchResponse } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly API_KEY = 'd95e4187';
  private readonly BASE_URL = 'https://www.omdbapi.com/';
  private readonly FAVORITES_KEY = 'moviflix_favorites';
  private readonly LEGACY_FAVORITES_KEY = 'cinesearch_favorites';

  constructor(private http: HttpClient) {}

  /** Search movies by title — uses ?s= endpoint */
  searchMovies(query: string, page: number = 1, type: string = '', year: string = ''): Observable<SearchResponse> {
    const typeParam = type ? `&type=${encodeURIComponent(type)}` : '';
    const yearParam = year ? `&y=${encodeURIComponent(year)}` : '';
    const url = `${this.BASE_URL}?s=${encodeURIComponent(query)}&page=${page}${typeParam}${yearParam}&apikey=${this.API_KEY}`;
    return this.http.get<SearchResponse>(url).pipe(
      catchError(err => throwError(() => new Error('Network error: ' + err.message)))
    );
  }

  /** Get full movie details — uses ?i= endpoint */
  getMovieById(imdbID: string): Observable<MovieDetail> {
    const url = `${this.BASE_URL}?i=${imdbID}&plot=full&apikey=${this.API_KEY}`;
    return this.http.get<MovieDetail>(url).pipe(
      catchError(err => throwError(() => new Error('Network error: ' + err.message)))
    );
  }

  // ── Favorites via localStorage ──────────────────────────────
  getFavorites(): MovieSearchResult[] {
    const raw = localStorage.getItem(this.FAVORITES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }

    // Backward compatibility: migrate old favorites key once.
    const legacyRaw = localStorage.getItem(this.LEGACY_FAVORITES_KEY);
    if (!legacyRaw) return [];

    try {
      const legacyParsed = JSON.parse(legacyRaw);
      if (!Array.isArray(legacyParsed)) return [];
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(legacyParsed));
      localStorage.removeItem(this.LEGACY_FAVORITES_KEY);
      return legacyParsed;
    } catch {
      return [];
    }
  }

  isFavorite(imdbID: string): boolean {
    return this.getFavorites().some(m => m.imdbID === imdbID);
  }

  toggleFavorite(movie: MovieSearchResult): void {
    const favorites = this.getFavorites();
    const idx = favorites.findIndex(m => m.imdbID === movie.imdbID);
    if (idx >= 0) {
      favorites.splice(idx, 1);
    } else {
      favorites.push(movie);
    }
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
  }
}
