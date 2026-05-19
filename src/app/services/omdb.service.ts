import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Movie, SearchResult } from '../models/movie.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OmdbService {
  private http = inject(HttpClient);
  private baseUrl = 'https://www.omdbapi.com/';
  private apiKey = environment.omdbKey;
  
  // Cache interne pour éviter les re-appels
  private cache = new Map<string, any>();

  searchMovies(query: string, page: number = 1, type?: string, year?: string): Observable<SearchResult> {
    const typeParam = type ? `&type=${type}` : '';
    const yearParam = year ? `&y=${year}` : '';
    const url = `${this.baseUrl}?apikey=${this.apiKey}&s=${encodeURIComponent(query)}&page=${page}${typeParam}${yearParam}`;
    
    if (this.cache.has(url)) {
      return of(this.cache.get(url));
    }

    return this.http.get<SearchResult>(url).pipe(
      tap(data => {
        if (data.Response === 'True') {
          this.cache.set(url, data);
        }
      }),
      catchError(() => of({ Search: [], totalResults: '0', Response: 'False' } as SearchResult))
    );
  }

  getMovieById(imdbID: string): Observable<Movie> {
    const url = `${this.baseUrl}?apikey=${this.apiKey}&i=${imdbID}&plot=full`;
    
    if (this.cache.has(url)) {
      return of(this.cache.get(url));
    }

    return this.http.get<Movie>(url).pipe(
      tap(data => {
        if (data.Response === 'True') {
          this.cache.set(url, data);
        }
      }),
      catchError(() => of({ Response: 'False' } as Movie))
    );
  }

  getMovieByTitle(title: string, plot: string = 'short'): Observable<Movie> {
    const url = `${this.baseUrl}?apikey=${this.apiKey}&t=${encodeURIComponent(title)}&plot=${plot}`;
    
    if (this.cache.has(url)) {
      return of(this.cache.get(url));
    }

    return this.http.get<Movie>(url).pipe(
      tap(data => {
        if (data.Response === 'True') {
          this.cache.set(url, data);
        }
      }),
      catchError(() => of({ Response: 'False' } as Movie))
    );
  }
}
