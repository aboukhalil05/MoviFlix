import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OmdbService } from '../../services/omdb.service';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';
import { Movie } from '../../models/movie.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MovieCardComponent, SkeletonLoaderComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-24 min-h-screen">
      <!-- Search Bar & Filters -->
      <div class="bg-white dark:bg-mv-dark-700 p-6 rounded-2xl border border-mv-dark-200 dark:border-white/[0.08] shadow-lg mb-8">
        <div class="relative mb-6">
          <input type="text" [formControl]="searchCtrl" placeholder="Rechercher un film, une série..." 
                 class="w-full bg-mv-dark-50 dark:bg-mv-dark-800 border border-mv-dark-200 dark:border-white/10 text-mv-dark-800 dark:text-mv-dark-50 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-mv-red-500 transition-all text-lg" />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 absolute left-4 top-1/2 -translate-y-1/2 text-mv-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          <!-- Genres (Chips) -->
          <div class="flex gap-2 overflow-x-auto pb-2 hide-scrollbar w-full lg:w-auto">
            <button *ngFor="let genre of genres" 
                    (click)="setGenre(genre)"
                    class="whitespace-nowrap px-4 py-2 rounded-full border transition-all text-sm font-medium"
                    [ngClass]="{
                      'bg-mv-red-500 text-white border-mv-red-500': activeGenre === genre,
                      'border-mv-dark-200 dark:border-white/10 text-mv-dark-500 dark:text-mv-dark-300 hover:bg-mv-dark-100 dark:hover:bg-mv-dark-600': activeGenre !== genre
                    }">
              {{ genre }}
            </button>
          </div>

          <!-- Type Filters -->
          <div class="flex gap-2 shrink-0">
            <button *ngFor="let type of types"
                    (click)="setType(type.value)"
                    class="px-4 py-2 rounded-lg border transition-all text-sm font-medium"
                    [ngClass]="{
                      'bg-mv-blue-700 text-white border-mv-blue-700': activeType === type.value,
                      'border-mv-dark-200 dark:border-white/10 text-mv-dark-500 dark:text-mv-dark-300 hover:bg-mv-dark-100 dark:hover:bg-mv-dark-600': activeType !== type.value
                    }">
              {{ type.label }}
            </button>
            <input type="number" [formControl]="yearCtrl" placeholder="Année" class="w-24 bg-mv-dark-50 dark:bg-mv-dark-800 border border-mv-dark-200 dark:border-white/10 text-mv-dark-800 dark:text-mv-dark-50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mv-red-500 text-sm" />
          </div>
        </div>
      </div>

      <!-- Results Area -->
      <div *ngIf="loading" class="mt-8">
        <app-skeleton-loader [count]="10"></app-skeleton-loader>
      </div>

      <div *ngIf="!loading && movies.length === 0 && searchCtrl.value" class="text-center py-20 bg-white dark:bg-mv-dark-700 rounded-xl border border-mv-dark-200 dark:border-white/[0.08]">
        <h3 class="text-2xl font-bebas text-mv-dark-800 dark:text-white">Aucun résultat</h3>
        <p class="text-mv-dark-500 dark:text-mv-dark-400 mt-2">Essayez avec d'autres mots-clés ou modifiez vos filtres.</p>
      </div>

      <div *ngIf="!loading && movies.length > 0" class="mt-8">
        <p class="text-mv-dark-500 dark:text-mv-dark-400 mb-6 font-medium">{{ totalResults }} résultats pour "{{ searchCtrl.value }}"</p>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          <app-movie-card *ngFor="let movie of movies" [movie]="movie"></app-movie-card>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center items-center gap-4 mt-12 mb-12" *ngIf="totalPages > 1">
          <button (click)="changePage(-1)" [disabled]="page === 1" class="px-4 py-2 rounded-md bg-white dark:bg-mv-dark-700 border border-mv-dark-200 dark:border-white/10 text-mv-dark-800 dark:text-mv-dark-50 disabled:opacity-50 hover:bg-mv-dark-100 dark:hover:bg-mv-dark-600 transition-colors font-medium">
            Précédent
          </button>
          <span class="text-mv-dark-500 dark:text-mv-dark-300 font-medium">Page {{ page }} sur {{ totalPages }}</span>
          <button (click)="changePage(1)" [disabled]="page === totalPages" class="px-4 py-2 rounded-md bg-white dark:bg-mv-dark-700 border border-mv-dark-200 dark:border-white/10 text-mv-dark-800 dark:text-mv-dark-50 disabled:opacity-50 hover:bg-mv-dark-100 dark:hover:bg-mv-dark-600 transition-colors font-medium">
            Suivant
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class SearchComponent implements OnInit {
  searchCtrl = new FormControl('');
  yearCtrl = new FormControl('');
  
  genres = ['Tous', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation'];
  activeGenre = 'Tous';
  
  types = [
    { label: 'Tous', value: '' },
    { label: 'Films', value: 'movie' },
    { label: 'Séries', value: 'series' },
    { label: 'Épisodes', value: 'episode' }
  ];
  activeType = '';

  movies: Movie[] = [];
  loading = false;
  page = 1;
  totalResults = 0;
  totalPages = 0;

  private omdb = inject(OmdbService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let shouldSearch = false;
      
      if (params['q'] && params['q'] !== this.searchCtrl.value) {
        this.searchCtrl.setValue(params['q'], { emitEvent: false });
        if (this.genres.includes(params['q'])) {
          this.activeGenre = params['q'];
        }
        shouldSearch = true;
      }
      if (params['year']) {
        this.yearCtrl.setValue(params['year'], { emitEvent: false });
        shouldSearch = true;
      }
      if (params['type']) {
        this.activeType = params['type'];
        shouldSearch = true;
      }
      if (params['page']) {
        this.page = +params['page'];
        shouldSearch = true;
      }
      
      if (shouldSearch || this.searchCtrl.value) {
        this.performSearch();
      } else {
        // Default search if empty
        this.searchCtrl.setValue('2023', { emitEvent: false });
        this.performSearch();
      }
    });

    this.searchCtrl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(val => {
      this.page = 1;
      if (!this.genres.includes(val || '')) {
        this.activeGenre = 'Tous';
      }
      this.updateUrl();
    });

    this.yearCtrl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.page = 1;
      this.updateUrl();
    });
  }

  setGenre(genre: string) {
    this.activeGenre = genre;
    const query = genre === 'Tous' ? 'action' : genre; // Fallback to avoid empty search errors on OMDB
    this.searchCtrl.setValue(query);
  }

  setType(type: string) {
    this.activeType = type;
    this.page = 1;
    this.updateUrl();
  }

  changePage(delta: number) {
    this.page += delta;
    this.updateUrl();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private updateUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.searchCtrl.value || null,
        year: this.yearCtrl.value || null,
        type: this.activeType || null,
        page: this.page > 1 ? this.page : null
      },
      queryParamsHandling: 'merge'
    });
  }

  private performSearch() {
    const query = this.searchCtrl.value;
    if (!query) {
      this.movies = [];
      this.totalResults = 0;
      this.totalPages = 0;
      return;
    }

    this.loading = true;
    this.omdb.searchMovies(query, this.page, this.activeType, this.yearCtrl.value || undefined)
      .subscribe(res => {
        this.loading = false;
        if (res.Response === 'True') {
          this.movies = res.Search;
          this.totalResults = parseInt(res.totalResults, 10);
          this.totalPages = Math.ceil(this.totalResults / 10);
        } else {
          this.movies = [];
          this.totalResults = 0;
          this.totalPages = 0;
        }
      });
  }
}
