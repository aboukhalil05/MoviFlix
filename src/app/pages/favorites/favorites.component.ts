import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { FavoritesService } from '../../services/favorites.service';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { Movie } from '../../models/movie.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, DragDropModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-24 min-h-screen">
      <div class="flex items-center justify-between mb-10">
        <h1 class="text-4xl md:text-5xl font-bebas text-mv-dark-800 dark:text-white">Mes Favoris</h1>
        
        <button *ngIf="movies().length > 1"
                (click)="toggleEditMode()"
                class="px-6 py-2 rounded-full font-medium transition-all shadow-sm"
                [ngClass]="{
                  'bg-mv-blue-700 text-white hover:bg-mv-blue-800': !isEditMode(),
                  'bg-mv-red-500 text-white hover:bg-mv-red-600': isEditMode()
                }">
          {{ isEditMode() ? 'Terminer' : 'Classer' }}
        </button>
      </div>

      <!-- Empty State -->
      <div *ngIf="movies().length === 0" class="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-mv-dark-700 rounded-2xl border border-mv-dark-200 dark:border-white/[0.08]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-mv-dark-300 dark:text-mv-dark-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h2 class="text-2xl font-bebas text-mv-dark-800 dark:text-white mb-2">Aucun favori pour le moment</h2>
        <p class="text-mv-dark-500 dark:text-mv-dark-400 mb-6">Commencez à explorer le catalogue pour ajouter vos films préférés.</p>
        <button routerLink="/search" class="px-6 py-3 bg-mv-red-600 hover:bg-mv-red-700 text-white rounded-full font-medium transition-colors">
          Explorer
        </button>
      </div>

      <!-- Normal Grid -->
      <div *ngIf="!isEditMode() && movies().length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div *ngFor="let movie of movies(); let i = index" class="relative group">
          <!-- Rank Badge -->
          <div *ngIf="i < 3" class="absolute -top-3 -left-3 z-20 w-10 h-10 rounded-full flex items-center justify-center font-bebas text-xl text-white shadow-lg border-2 border-white dark:border-mv-dark-800 transition-transform group-hover:scale-110"
               [ngClass]="{'bg-yellow-500': i === 0, 'bg-gray-400': i === 1, 'bg-amber-700': i === 2}">
            #{{ i + 1 }}
          </div>
          <div *ngIf="i >= 3" class="absolute -top-3 -left-3 z-20 w-8 h-8 rounded-full bg-mv-dark-800 dark:bg-mv-dark-900 border-2 border-white dark:border-mv-dark-800 flex items-center justify-center font-bebas text-white shadow-lg text-sm transition-transform group-hover:scale-110">
            #{{ i + 1 }}
          </div>
          
          <button (click)="removeFavorite(movie.imdbID)" class="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-white dark:bg-mv-dark-800 text-mv-red-500 border border-mv-dark-200 dark:border-white/10 flex items-center justify-center shadow-lg hover:bg-mv-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <app-movie-card [movie]="movie"></app-movie-card>
        </div>
      </div>

      <!-- Drag & Drop List -->
      <div *ngIf="isEditMode() && movies().length > 0" 
           cdkDropList 
           (cdkDropListDropped)="drop($event)"
           class="max-w-3xl mx-auto space-y-4">
        <div *ngFor="let movie of movies(); let i = index" 
             cdkDrag
             class="flex items-center gap-4 bg-white dark:bg-mv-dark-700 p-4 rounded-xl border border-mv-dark-200 dark:border-white/[0.08] shadow cursor-move group transition-colors hover:bg-mv-dark-50 dark:hover:bg-mv-dark-600">
          
          <div class="text-mv-dark-400 group-hover:text-mv-red-500 cursor-grab px-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          
          <div class="font-bebas text-2xl w-10 text-center" [ngClass]="{'text-yellow-500': i === 0, 'text-gray-400': i === 1, 'text-amber-700': i === 2, 'text-mv-dark-400': i >= 3}">
            #{{ i + 1 }}
          </div>
          
          <img [src]="movie.Poster !== 'N/A' ? movie.Poster : 'assets/no-poster.png'" class="w-12 h-16 object-cover rounded shadow-sm">
          
          <div class="flex-1 min-w-0">
            <h3 class="font-bebas text-xl text-mv-dark-800 dark:text-white truncate">{{ movie.Title }}</h3>
            <p class="text-sm text-mv-dark-500 dark:text-mv-dark-300">{{ movie.Year }} • {{ movie.Genre }}</p>
          </div>
          
          <button (click)="removeFavorite(movie.imdbID)" class="p-2 text-mv-dark-400 hover:text-white hover:bg-mv-red-500 transition-colors rounded-full focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(225, 29, 72, 0.4), 0 8px 10px -6px rgba(225, 29, 72, 0.2);
      border: 1px solid rgba(225, 29, 72, 0.5);
      background-color: var(--tw-bg-opacity, #fff);
    }
    .dark .cdk-drag-preview {
      background-color: #1e293b;
    }
    .cdk-drag-placeholder { opacity: 0.3; }
    .cdk-drag-animating { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
    .cdk-drop-list-dragging .cdk-drag { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
  `]
})
export class FavoritesComponent implements OnInit {
  private favoritesService = inject(FavoritesService);
  
  movies = signal<Movie[]>([]);
  isEditMode = signal<boolean>(false);

  ngOnInit() {
    this.movies.set(this.favoritesService.getAll());
  }

  toggleEditMode() {
    this.isEditMode.update(v => !v);
  }

  removeFavorite(id: string) {
    this.favoritesService.removeFavorite(id);
    this.movies.set(this.favoritesService.getAll());
  }

  drop(event: CdkDragDrop<Movie[]>) {
    const arr = [...this.movies()];
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    this.movies.set(arr);
    this.favoritesService.reorder(arr);
  }
}
