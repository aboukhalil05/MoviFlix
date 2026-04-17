import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MovieSearchResult } from '../../models/movie.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: MovieSearchResult[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.favorites = this.movieService.getFavorites();
  }

  removeFromFavorites(event: Event, movie: MovieSearchResult): void {
    event.preventDefault();
    event.stopPropagation();
    this.movieService.toggleFavorite(movie);
    // Refresh local list after removal
    this.favorites = this.movieService.getFavorites();
  }

  getPosterUrl(poster: string): string {
    return poster && poster !== 'N/A' ? poster : 'assets/no-poster.png';
  }

  clearAll(): void {
    if (!confirm('Remove all favorites?')) return;
    this.favorites.forEach(m => this.movieService.toggleFavorite(m));
    this.favorites = [];
  }
}
