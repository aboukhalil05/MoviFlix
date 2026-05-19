import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OmdbService } from '../../services/omdb.service';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieCardComponent, SkeletonLoaderComponent],
  template: `
    <!-- Hero Section -->
    <div class="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-mv-dark-800">
      <div class="absolute inset-0" style="background-image: linear-gradient(rgba(225,29,72,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(225,29,72,.06) 1px, transparent 1px); background-size: 40px 40px;"></div>
      <div class="z-10 text-center px-4">
        <h1 class="text-7xl md:text-9xl font-bebas text-white tracking-widest drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]">
          <span class="text-mv-red-500">M</span>OVIFLIX
        </h1>
        <p class="mt-4 text-mv-dark-300 text-lg md:text-xl tracking-widest uppercase">L'expérience cinéma premium</p>
        <button routerLink="/search" class="mt-10 bg-mv-red-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-mv-red-700 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(225,29,72,0.4)]">
          Explorer le catalogue
        </button>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-mv-dark-50 dark:from-mv-dark-800 to-transparent"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- MoodPicker -->
      <section class="mb-16 relative z-10">
        <h2 class="text-2xl font-bebas text-mv-dark-800 dark:text-white mb-6">Quelle est votre humeur ?</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <a *ngFor="let mood of moods" [routerLink]="['/search']" [queryParams]="{q: mood.query}" 
             class="group relative h-32 rounded-xl overflow-hidden cursor-pointer shadow-lg block">
            <div [class]="'absolute inset-0 bg-gradient-to-br opacity-80 group-hover:opacity-100 transition-opacity duration-300 ' + mood.color"></div>
            <div class="absolute inset-0 flex items-center justify-center text-white font-bebas text-2xl tracking-wide shadow-black drop-shadow-md group-hover:scale-110 transition-transform duration-300">
              {{ mood.name }}
            </div>
          </a>
        </div>
      </section>

      <!-- Sections -->
      <section class="mb-12" *ngFor="let section of sections">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bebas text-mv-dark-800 dark:text-white">{{ section.title }}</h2>
          <a [routerLink]="['/search']" [queryParams]="{q: section.query}" class="text-mv-red-500 hover:text-mv-red-600 text-sm font-medium transition-colors">Voir tout</a>
        </div>
        
        <div class="flex overflow-x-auto pb-6 gap-6 snap-x hide-scrollbar">
          <ng-container *ngIf="section.movies.length > 0; else loading">
            <div class="snap-start shrink-0 w-[160px] md:w-[250px]" *ngFor="let movie of section.movies">
              <app-movie-card [movie]="movie"></app-movie-card>
            </div>
          </ng-container>
          <ng-template #loading>
            <div class="w-full">
              <app-skeleton-loader [count]="5"></app-skeleton-loader>
            </div>
          </ng-template>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class HomeComponent implements OnInit {
  private omdb = inject(OmdbService);
  
  moods = [
    { name: 'Rire', query: 'comedy', color: 'from-yellow-400 to-yellow-600' },
    { name: 'Peur', query: 'horror', color: 'from-mv-dark-800 to-black' },
    { name: 'Émotion', query: 'drama', color: 'from-blue-400 to-blue-600' },
    { name: 'Aventure', query: 'adventure', color: 'from-green-500 to-emerald-700' },
    { name: 'Mystère', query: 'mystery', color: 'from-purple-500 to-purple-800' },
    { name: 'Action', query: 'action', color: 'from-mv-red-500 to-mv-red-800' },
  ];

  sections = [
    { title: 'Tendances Héroïques', query: 'marvel', movies: [] as any[] },
    { title: 'Sagas Épiques', query: 'batman', movies: [] as any[] },
    { title: 'Action 2023', query: 'action', year: '2023', movies: [] as any[] },
  ];

  ngOnInit() {
    this.sections.forEach(section => {
      this.omdb.searchMovies(section.query, 1, 'movie', section.year).subscribe(res => {
        if (res.Response === 'True') {
          section.movies = res.Search.slice(0, 10);
        }
      });
    });
  }
}
