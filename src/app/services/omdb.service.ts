import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { MovieDetail, SearchResponse } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class OmdbService {
  private readonly baseUrl = environment.omdbBaseUrl;
  private readonly apiKey = environment.apiKey;

  constructor(private http: HttpClient) {}

  searchMovies(query: string, page: number = 1, type?: string): Observable<SearchResponse> {
    const typeParam = type ? `&type=${encodeURIComponent(type)}` : '';
    const url = `${this.baseUrl}?s=${encodeURIComponent(query)}&page=${page}${typeParam}&apikey=${this.apiKey}`;

    return this.http.get<SearchResponse>(url).pipe(
      catchError(error => throwError(() => new Error(`OMDB search failed: ${error.message}`)))
    );
  }

  getMovieById(id: string): Observable<MovieDetail> {
    const url = `${this.baseUrl}?i=${encodeURIComponent(id)}&plot=full&apikey=${this.apiKey}`;

    return this.http.get<MovieDetail>(url).pipe(
      catchError(error => throwError(() => new Error(`OMDB get by id failed: ${error.message}`)))
    );
  }

  getMovieByTitle(title: string): Observable<MovieDetail> {
    const url = `${this.baseUrl}?t=${encodeURIComponent(title)}&plot=full&apikey=${this.apiKey}`;

    return this.http.get<MovieDetail>(url).pipe(
      catchError(error => throwError(() => new Error(`OMDB get by title failed: ${error.message}`)))
    );
  }
}
