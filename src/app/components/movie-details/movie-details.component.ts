import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MovieDetail, MovieSearchResult } from '../../models/movie.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroChevronLeft, heroExclamationTriangle, heroHeart, heroTrophy } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIcon],
  providers: [provideIcons({ heroChevronLeft, heroHeart, heroExclamationTriangle, heroTrophy })],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie: MovieDetail | null = null;
  loading = true;
  error = '';
  isFav = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    // Read the :id param from the URL
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Invalid movie ID.';
      this.loading = false;
      return;
    }
    this.isFav = this.movieService.isFavorite(id);
    this.loadMovie(id);
  }

  loadMovie(id: string): void {
    this.movieService.getMovieById(id).subscribe({
      next: data => {
        this.loading = false;
        if (data.Response === 'True') {
          this.movie = data;
        } else {
          this.error = 'Movie not found.';
        }
      },
      error: err => {
        this.loading = false;
        this.error = err.message || 'Failed to load movie.';
      }
    });
  }

  toggleFavorite(): void {
    if (!this.movie) return;
    // Build a MovieSearchResult-like object for the service
    const mini: MovieSearchResult = {
      Title: this.movie.Title,
      Year: this.movie.Year,
      imdbID: this.movie.imdbID,
      Type: this.movie.Type,
      Poster: this.movie.Poster
    };
    this.movieService.toggleFavorite(mini);
    this.isFav = !this.isFav;
  }

  goBack(): void {
    window.history.length > 1 ? window.history.back() : this.router.navigate(['/search']);
  }

  getPosterUrl(poster: string): string {
    return poster && poster !== 'N/A' ? poster : 'assets/no-poster.png';
  }

  /** Convert IMDb rating (0–10) to a percentage for the ring display */
  get imdbPercent(): number {
    if (!this.movie) return 0;
    return Math.round((parseFloat(this.movie.imdbRating) / 10) * 100);
  }

  /** Split genre/actors strings into arrays for *ngFor display */
  get genreList(): string[] {
    return this.movie?.Genre?.split(',').map(g => g.trim()) || [];
  }

  get actorList(): string[] {
    return this.movie?.Actors?.split(',').map(a => a.trim()) || [];
  }

  get imdbScoreValue(): string {
    if (!this.movie?.imdbRating || this.movie.imdbRating === 'N/A') return 'N/A';
    return `${this.movie.imdbRating}/10`;
  }

  get imdbScorePercent(): number {
    if (!this.movie?.imdbRating || this.movie.imdbRating === 'N/A') return 0;
    const parsed = parseFloat(this.movie.imdbRating);
    if (Number.isNaN(parsed)) return 0;
    return Math.max(0, Math.min(100, Math.round((parsed / 10) * 100)));
  }

  get rottenScoreValue(): string {
    const rating = this.getRatingValue('Rotten Tomatoes');
    return rating || 'N/A';
  }

  get rottenScorePercent(): number {
    return this.toPercent(this.rottenScoreValue);
  }

  get metacriticScoreValue(): string {
    if (this.movie?.Metascore && this.movie.Metascore !== 'N/A') {
      return `${this.movie.Metascore}/100`;
    }
    return this.getRatingValue('Metacritic') || 'N/A';
  }

  get metacriticScorePercent(): number {
    return this.toPercent(this.metacriticScoreValue);
  }

  private getRatingValue(source: string): string | null {
    if (!this.movie?.Ratings?.length) return null;
    const item = this.movie.Ratings.find(r => r.Source === source);
    return item?.Value || null;
  }

  private toPercent(value: string): number {
    if (!value || value === 'N/A') return 0;

    if (value.includes('%')) {
      const pct = parseFloat(value.replace('%', ''));
      return Number.isNaN(pct) ? 0 : Math.max(0, Math.min(100, Math.round(pct)));
    }

    if (value.includes('/')) {
      const [numRaw, denRaw] = value.split('/');
      const num = parseFloat(numRaw);
      const den = parseFloat(denRaw);
      if (Number.isNaN(num) || Number.isNaN(den) || den === 0) return 0;
      return Math.max(0, Math.min(100, Math.round((num / den) * 100)));
    }

    const numeric = parseFloat(value);
    if (Number.isNaN(numeric)) return 0;
    return Math.max(0, Math.min(100, Math.round(numeric)));
  }
}
