import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="group relative rounded-lg overflow-hidden bg-white dark:bg-mv-dark-700 border border-mv-dark-200 dark:border-white/[0.08] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-mv-red-500/10"
      (click)="goToDetail()">
      
      <!-- Poster -->
      <img [src]="posterUrl" [alt]="movie.Title" class="w-full h-[300px] md:h-[400px] object-cover transition-all duration-500 group-hover:scale-105" />
      
      <!-- Type Badge -->
      <div class="absolute top-2 left-2 px-2 py-1 bg-mv-red-500/80 backdrop-blur-sm rounded text-[10px] font-bold text-white tracking-widest uppercase">
        {{ movie.Type }}
      </div>
      
      <!-- Favorite Button -->
      <button 
        class="absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 hover:bg-mv-red-600"
        [ngClass]="{'bg-mv-red-500 text-white': isFavorite(), 'bg-black/50 text-white': !isFavorite()}"
        (click)="toggleFavorite($event)">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" [attr.fill]="isFavorite() ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-mv-dark-900 via-mv-dark-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
        <h3 class="text-white font-bebas text-xl truncate">{{ movie.Title }}</h3>
        <div class="flex items-center gap-2 text-mv-dark-300 text-sm mt-1">
          <span>{{ movie.Year }}</span>
          <span *ngIf="movie.imdbRating && movie.imdbRating !== 'N/A'" class="flex items-center gap-1 text-yellow-400">
            ★ {{ movie.imdbRating }}
          </span>
        </div>
        <div *ngIf="movie.Genre && movie.Genre !== 'N/A'" class="text-xs text-mv-dark-300 mt-1 truncate">
          {{ movie.Genre }}
        </div>
      </div>
    </div>
  `
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;
  private router = inject(Router);
  private favoritesService = inject(FavoritesService);

  get posterUrl(): string {
    return this.movie.Poster !== 'N/A' ? this.movie.Poster : 'assets/no-poster.png';
  }

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.movie.imdbID);
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    if (this.isFavorite()) {
      this.favoritesService.removeFavorite(this.movie.imdbID);
    } else {
      this.favoritesService.addFavorite(this.movie);
    }
  }

  goToDetail(): void {
    this.router.navigate(['/movie', this.movie.imdbID]);
  }
}
