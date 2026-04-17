import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MovieDetail, MovieSearchResult } from '../../models/movie.model';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
}
