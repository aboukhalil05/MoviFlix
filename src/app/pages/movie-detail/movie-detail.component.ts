import { Component, OnInit, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OmdbService } from '../../services/omdb.service';
import { FavoritesService } from '../../services/favorites.service';
import { HistoryService } from '../../services/history.service';
import { Movie } from '../../models/movie.model';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent, MovieCardComponent, RouterLink],
  template: `
    <div *ngIf="loading" class="min-h-screen pt-24 px-4">
      <app-skeleton-loader [count]="1"></app-skeleton-loader>
    </div>

    <div *ngIf="movie && !loading" class="min-h-screen pb-20">
      <!-- Backdrop/Poster Hero -->
      <div class="relative h-[60vh] md:h-[70vh] w-full">
        <img [src]="posterUrl" class="w-full h-full object-cover object-top" [alt]="movie.Title">
        <div class="absolute inset-0 bg-gradient-to-t from-mv-dark-50 dark:from-mv-dark-800 via-mv-dark-800/60 to-transparent"></div>
        
        <div class="absolute bottom-0 left-0 w-full px-4 md:px-12 pb-8 max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
            <!-- Mobile Poster (Optional, hidden on small if backdrop is enough, but good for detail) -->
            <img [src]="posterUrl" class="hidden md:block w-48 rounded-xl shadow-2xl border-4 border-mv-dark-800 translate-y-12 z-10" />
            
            <div class="flex-1 z-10">
              <div class="flex flex-wrap items-center gap-3 mb-3">
                <span class="px-3 py-1 bg-mv-red-500 text-white text-xs font-bold tracking-widest rounded uppercase">{{ movie.Type }}</span>
                <span *ngIf="movie.Rated !== 'N/A'" class="px-2 py-1 border border-white/20 text-white text-xs rounded">{{ movie.Rated }}</span>
                <span class="text-mv-dark-300 text-sm font-medium">{{ movie.Year }} • {{ movie.Runtime }}</span>
              </div>
              <h1 class="text-5xl md:text-7xl font-bebas text-white drop-shadow-md">{{ movie.Title }}</h1>
              <p class="text-mv-red-400 mt-2 font-medium">{{ movie.Genre }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 md:px-12 mt-16 md:mt-20">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <div class="flex items-center gap-4 mb-8">
              <button 
                (click)="toggleFavorite()"
                class="flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-sm"
                [ngClass]="{
                  'bg-mv-red-600 text-white hover:bg-mv-red-700': isFavorite(),
                  'bg-white dark:bg-mv-dark-700 text-mv-dark-800 dark:text-white hover:bg-mv-red-50 dark:hover:bg-mv-dark-600 border border-mv-dark-200 dark:border-white/10': !isFavorite()
                }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" [attr.fill]="isFavorite() ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {{ isFavorite() ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
              </button>

              <!-- Awards Badge -->
              <div *ngIf="movie.Awards !== 'N/A'" class="flex items-center gap-2 px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                🏆 {{ movie.Awards }}
              </div>
            </div>

            <h3 class="text-2xl font-bebas text-mv-dark-800 dark:text-white mb-4">Synopsis</h3>
            <p class="text-mv-dark-600 dark:text-mv-dark-300 leading-relaxed text-lg mb-8">
              {{ movie.Plot }}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 class="text-sm text-mv-dark-400 uppercase tracking-widest mb-2">Réalisateur</h4>
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let dir of split(movie.Director)" [routerLink]="['/search']" [queryParams]="{q: dir}" class="cursor-pointer px-3 py-1 bg-white dark:bg-mv-dark-700 border border-mv-dark-200 dark:border-white/10 text-mv-dark-700 dark:text-mv-dark-100 rounded-md text-sm hover:bg-mv-red-500 hover:text-white dark:hover:bg-mv-red-500 dark:hover:border-mv-red-500 transition-colors">{{ dir }}</span>
                </div>
              </div>
              <div>
                <h4 class="text-sm text-mv-dark-400 uppercase tracking-widest mb-2">Scénaristes</h4>
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let writer of split(movie.Writer)" class="px-3 py-1 bg-mv-dark-100 dark:bg-mv-dark-800 border border-transparent dark:border-white/5 text-mv-dark-700 dark:text-mv-dark-100 rounded-md text-sm">{{ writer }}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-sm text-mv-dark-400 uppercase tracking-widest mb-2">Acteurs principaux</h4>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let actor of split(movie.Actors)" [routerLink]="['/search']" [queryParams]="{q: actor}" class="cursor-pointer px-4 py-2 bg-white dark:bg-mv-dark-700 border border-mv-dark-200 dark:border-white/10 rounded-full text-sm font-medium hover:border-mv-red-500 dark:hover:border-mv-red-500 hover:text-mv-red-500 transition-colors shadow-sm">{{ actor }}</span>
              </div>
            </div>
          </div>

          <!-- Sidebar (Scores & Details) -->
          <div class="space-y-6">
            <div class="bg-white dark:bg-mv-dark-700 p-6 rounded-2xl border border-mv-dark-200 dark:border-white/[0.08] shadow-lg">
              <h3 class="text-xl font-bebas text-mv-dark-800 dark:text-white mb-6">Scores</h3>
              
              <div class="space-y-5">
                <div *ngIf="getRating('Internet Movie Database') as r">
                  <div class="flex justify-between text-sm mb-1 font-medium"><span>IMDb</span> <span>{{ r.Value }}</span></div>
                  <div class="h-2 bg-mv-dark-100 dark:bg-mv-dark-800 rounded-full overflow-hidden border border-mv-dark-200 dark:border-white/5">
                    <div class="h-full bg-mv-red-500 transition-all duration-1000 ease-out" [style.width]="getPercentage(r.Value)"></div>
                  </div>
                </div>
                <div *ngIf="getRating('Rotten Tomatoes') as r">
                  <div class="flex justify-between text-sm mb-1 font-medium"><span>Rotten Tomatoes</span> <span>{{ r.Value }}</span></div>
                  <div class="h-2 bg-mv-dark-100 dark:bg-mv-dark-800 rounded-full overflow-hidden border border-mv-dark-200 dark:border-white/5">
                    <div class="h-full bg-green-500 transition-all duration-1000 ease-out delay-150" [style.width]="getPercentage(r.Value)"></div>
                  </div>
                </div>
                <div *ngIf="getRating('Metacritic') as r">
                  <div class="flex justify-between text-sm mb-1 font-medium"><span>Metacritic</span> <span>{{ r.Value }}</span></div>
                  <div class="h-2 bg-mv-dark-100 dark:bg-mv-dark-800 rounded-full overflow-hidden border border-mv-dark-200 dark:border-white/5">
                    <div class="h-full bg-blue-500 transition-all duration-1000 ease-out delay-300" [style.width]="getPercentage(r.Value)"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-mv-dark-700 p-6 rounded-2xl border border-mv-dark-200 dark:border-white/[0.08] shadow-lg space-y-4">
              <div *ngIf="movie.BoxOffice && movie.BoxOffice !== 'N/A'">
                <p class="text-sm text-mv-dark-400">Box Office</p>
                <p class="text-lg font-medium text-mv-dark-800 dark:text-white">{{ movie.BoxOffice }}</p>
              </div>
              <div *ngIf="movie.Country !== 'N/A'">
                <p class="text-sm text-mv-dark-400">Pays</p>
                <p class="text-lg font-medium text-mv-dark-800 dark:text-white">{{ movie.Country }}</p>
              </div>
              <div *ngIf="movie.Language !== 'N/A'">
                <p class="text-sm text-mv-dark-400">Langues</p>
                <p class="text-lg font-medium text-mv-dark-800 dark:text-white">{{ movie.Language }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Lazy Loaded Sections -->
        <div class="mt-20 space-y-16" #lazySections>
          <section *ngIf="directorMovies.length > 0">
            <h2 class="text-2xl font-bebas text-mv-dark-800 dark:text-white mb-6">Du même réalisateur</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <app-movie-card *ngFor="let m of directorMovies" [movie]="m"></app-movie-card>
            </div>
          </section>

          <section *ngIf="actorMovies.length > 0">
            <h2 class="text-2xl font-bebas text-mv-dark-800 dark:text-white mb-6">Avec les mêmes acteurs</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <app-movie-card *ngFor="let m of actorMovies" [movie]="m"></app-movie-card>
            </div>
          </section>
        </div>
      </div>
    </div>
  `
})
export class MovieDetailComponent implements OnInit, AfterViewInit {
  movie: Movie | null = null;
  loading = true;
  directorMovies: Movie[] = [];
  actorMovies: Movie[] = [];

  @ViewChild('lazySections') lazySections!: ElementRef;

  private route = inject(ActivatedRoute);
  private omdb = inject(OmdbService);
  private favorites = inject(FavoritesService);
  private history = inject(HistoryService);

  get posterUrl() {
    return this.movie?.Poster !== 'N/A' ? this.movie?.Poster : 'assets/no-poster.png';
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.loading = true;
        this.movie = null;
        this.directorMovies = [];
        this.actorMovies = [];
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return this.omdb.getMovieById(params.get('id')!);
      })
    ).subscribe(movie => {
      this.loading = false;
      if (movie.Response === 'True') {
        this.movie = movie;
        this.history.addToHistory(movie);
      }
    });
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && this.movie) {
        this.loadRecommendations();
        observer.disconnect();
      }
    });
    if (this.lazySections) {
      observer.observe(this.lazySections.nativeElement);
    }
  }

  isFavorite() {
    return this.movie ? this.favorites.isFavorite(this.movie.imdbID) : false;
  }

  toggleFavorite() {
    if (this.movie) {
      if (this.isFavorite()) {
        this.favorites.removeFavorite(this.movie.imdbID);
      } else {
        this.favorites.addFavorite(this.movie);
      }
    }
  }

  split(str: string): string[] {
    if (!str || str === 'N/A') return [];
    return str.split(',').map(s => s.trim().replace(/ \(.*?\)/g, ''));
  }

  getRating(source: string) {
    return this.movie?.Ratings?.find(r => r.Source === source);
  }

  getPercentage(value: string): string {
    if (value.includes('/100')) return value.replace('/100', '%');
    if (value.includes('/10')) return (parseFloat(value) * 10) + '%';
    if (value.includes('%')) return value;
    return '0%';
  }

  private loadRecommendations() {
    if (!this.movie) return;
    
    const firstDirector = this.split(this.movie.Director)[0];
    if (firstDirector) {
      this.omdb.searchMovies(firstDirector).subscribe(res => {
        if (res.Response === 'True') {
          this.directorMovies = res.Search.filter(m => m.imdbID !== this.movie!.imdbID).slice(0, 4);
        }
      });
    }

    const firstActor = this.split(this.movie.Actors)[0];
    if (firstActor) {
      this.omdb.searchMovies(firstActor).subscribe(res => {
        if (res.Response === 'True') {
          this.actorMovies = res.Search.filter(m => m.imdbID !== this.movie!.imdbID).slice(0, 4);
        }
      });
    }
  }
}
