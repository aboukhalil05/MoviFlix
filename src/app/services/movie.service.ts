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
  private readonly FAVORITES_KEY = 'cinesearch_favorites';

  constructor(private http: HttpClient) {}

  /** Search movies by title — uses ?s= endpoint */
  searchMovies(query: string, page: number = 1): Observable<SearchResponse> {
    const url = `${this.BASE_URL}?s=${encodeURIComponent(query)}&page=${page}&apikey=${this.API_KEY}`;
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
    return raw ? JSON.parse(raw) : [];
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
