import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieSearchResult } from '../../models/movie.model';
import { FavoritesService } from '../../services/favorites.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroHeart, heroMagnifyingGlass, heroTrash, heroXMark } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIcon],
  providers: [provideIcons({ heroTrash, heroHeart, heroMagnifyingGlass, heroXMark })],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: MovieSearchResult[] = [];

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.favorites = this.favoritesService.getAll();
  }

  removeFromFavorites(event: Event, movie: MovieSearchResult): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoritesService.remove(movie.imdbID);
    this.favorites = this.favoritesService.getAll();
  }

  getPosterUrl(poster: string): string {
    return poster && poster !== 'N/A' ? poster : 'assets/no-poster.png';
  }

  clearAll(): void {
    if (!confirm('Remove all favorites?')) return;
    this.favorites.forEach(m => this.favoritesService.remove(m.imdbID));
    this.favorites = [];
  }
}
