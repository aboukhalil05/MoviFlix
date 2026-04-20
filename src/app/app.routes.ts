import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./components/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./components/movie-details/movie-details.component').then(m => m.MovieDetailsComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./components/favorites/favorites.component').then(m => m.FavoritesComponent)
  },
  { path: '**', redirectTo: '' }
];
