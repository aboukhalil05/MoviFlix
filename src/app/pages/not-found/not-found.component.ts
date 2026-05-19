import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { RandomMovieService } from '../../services/random-movie.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-mv-dark-800 relative overflow-hidden">
      <!-- Grille rouge subtile -->
      <div class="absolute inset-0" style="background-image: linear-gradient(rgba(225,29,72,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(225,29,72,.06) 1px, transparent 1px); background-size: 40px 40px;"></div>
      
      <div class="z-10 flex flex-col items-center text-center px-4">
        <!-- SVG Animé -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-mv-red-500 mb-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>

        <h1 class="font-bebas text-8xl md:text-9xl text-mv-red-500 drop-shadow-lg">ERREUR 404</h1>
        <p class="text-xl md:text-2xl text-mv-dark-300 font-medium mt-4 tracking-wide uppercase">Cette scène a été coupée au montage</p>
        
        <div class="flex flex-col sm:flex-row gap-4 mt-10">
          <button routerLink="/" class="px-8 py-3 bg-mv-red-600 hover:bg-mv-red-700 text-white rounded-md font-medium transition-colors border border-mv-red-600 shadow-[0_0_15px_rgba(225,29,72,0.4)]">
            Retour à l'accueil
          </button>
          <button (click)="goToRandom()" class="px-8 py-3 bg-transparent border border-mv-red-500/40 text-mv-red-400 hover:bg-mv-red-500/10 rounded-md font-medium transition-colors">
            Film aléatoire
          </button>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {
  private randomMovie = inject(RandomMovieService);
  private router = inject(Router);

  goToRandom() {
    const id = this.randomMovie.getRandomId();
    this.router.navigate(['/movie', id]);
  }
}
