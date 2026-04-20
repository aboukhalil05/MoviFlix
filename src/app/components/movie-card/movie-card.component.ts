import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieSearchResult } from '../../models/movie.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroHeart } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIcon],
  providers: [provideIcons({ heroHeart })],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: MovieSearchResult;
  @Input() favorite = false;
  @Output() favoriteToggle = new EventEmitter<{ event: Event; movie: MovieSearchResult }>();

  onFavoriteToggle(event: Event): void {
    this.favoriteToggle.emit({ event, movie: this.movie });
  }

  getPosterUrl(poster: string): string {
    return poster && poster !== 'N/A' ? poster : 'assets/no-poster.png';
  }
}
