import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { SearchStateService } from './services/search-state.service';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { SearchShortcutDirective } from './directives/search-shortcut.directive';
import { FavoritesService } from './services/favorites.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, BreadcrumbComponent, SearchShortcutDirective],
  template: `
    <div class="min-h-screen bg-mv-dark-50 dark:bg-mv-dark-800 text-mv-dark-800 dark:text-mv-dark-50 transition-colors duration-200" appSearchShortcut>
      
      <!-- Cinematic Floating Bar -->
      <nav class="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300"
           [ngClass]="isScrolled ? 'py-1.5' : 'py-2'">
        <div class="rounded-2xl backdrop-blur-md shadow-lg transition-colors duration-300 px-4 md:px-6 py-3 flex items-center justify-between"
             [ngClass]="theme.isDark() ? 'bg-mv-dark-800/90 border border-white/[0.06]' : 'bg-white/90 border border-mv-dark-200'">
          
          <!-- [GAUCHE] Logo -->
          <a routerLink="/" class="flex flex-col items-start leading-none shrink-0 group">
            <span class="font-bebas text-[26px] tracking-wide" [ngClass]="theme.isDark() ? 'text-white' : 'text-mv-dark-800'">
              <span class="text-mv-red-500">M</span>OVIFLIX
            </span>
            <span class="text-[10px] tracking-[4px] text-mv-red-400 font-medium ml-0.5">STREAMING</span>
          </a>

          <!-- Mobile Toggle Hamburger -->
          <button class="md:hidden p-2 text-mv-dark-500 dark:text-mv-dark-300" (click)="toggleMobileMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- [CENTRE] Liens Desktop -->
          <div class="hidden md:flex items-center gap-2 lg:gap-4">
            <a routerLink="/" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="active-link" class="nav-link relative px-4 py-1.5 text-sm font-medium transition-colors text-mv-dark-600 dark:text-mv-dark-300 hover:text-mv-dark-800 dark:hover:text-white">Accueil</a>
            <a routerLink="/search" routerLinkActive="active-link" class="nav-link relative px-4 py-1.5 text-sm font-medium transition-colors text-mv-dark-600 dark:text-mv-dark-300 hover:text-mv-dark-800 dark:hover:text-white">Découvrir</a>
            <a routerLink="/search" [queryParams]="{type: 'series'}" routerLinkActive="active-link" class="nav-link relative px-4 py-1.5 text-sm font-medium transition-colors text-mv-dark-600 dark:text-mv-dark-300 hover:text-mv-dark-800 dark:hover:text-white">Séries</a>
            <a routerLink="/favorites" routerLinkActive="active-link" class="nav-link relative px-4 py-1.5 text-sm font-medium transition-colors text-mv-dark-600 dark:text-mv-dark-300 hover:text-mv-dark-800 dark:hover:text-white flex items-center gap-1.5">
              Favoris
              <span *ngIf="favCount() > 0" class="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-mv-red-500 text-[10px] font-bold text-white px-1">{{ favCount() }}</span>
            </a>
          </div>

          <!-- [DROITE] Actions Desktop -->
          <div class="hidden md:flex items-center gap-4 shrink-0">
            <!-- Search -->
            <div class="relative group cursor-pointer" (click)="openSearch()">
              <div class="p-2 rounded-full hover:bg-mv-dark-100 dark:hover:bg-white/5 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-mv-dark-600 dark:text-mv-dark-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <!-- Tooltip Ctrl+K -->
              <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-[10px] bg-mv-dark-800 text-white px-2 py-1 rounded whitespace-nowrap">
                Ctrl+K
              </div>
            </div>

            <!-- Theme Toggle -->
            <button (click)="theme.toggle()" class="p-2 rounded-full hover:bg-mv-dark-100 dark:hover:bg-white/5 transition-colors text-mv-dark-600 dark:text-mv-dark-300">
              <svg *ngIf="!theme.isDark()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <svg *ngIf="theme.isDark()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>

            <!-- Avatar -->
            <div class="w-9 h-9 rounded-full ring-2 ring-mv-red-500 bg-mv-dark-600 text-mv-red-400 flex items-center justify-center font-bebas text-lg shadow-[0_0_10px_rgba(225,29,72,0.3)]">
              MV
            </div>
          </div>
        </div>
      </nav>

      <!-- Mobile Menu Drawer -->
      <div class="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300 md:hidden"
           [class.opacity-100]="isMobileMenuOpen" [class.pointer-events-auto]="isMobileMenuOpen"
           [class.opacity-0]="!isMobileMenuOpen" [class.pointer-events-none]="!isMobileMenuOpen"
           (click)="toggleMobileMenu()">
      </div>
      <div class="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-mv-dark-800 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl border-l border-mv-dark-200 dark:border-white/[0.06] md:hidden"
           [class.translate-x-0]="isMobileMenuOpen" [class.translate-x-full]="!isMobileMenuOpen">
        <div class="p-4 flex justify-end">
          <button (click)="toggleMobileMenu()" class="p-2 text-mv-dark-500 dark:text-mv-dark-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex flex-col gap-2 p-6">
          <a routerLink="/" (click)="toggleMobileMenu()" class="text-xl font-bebas text-mv-dark-800 dark:text-white py-2 border-b border-mv-dark-100 dark:border-white/5">Accueil</a>
          <a routerLink="/search" (click)="toggleMobileMenu()" class="text-xl font-bebas text-mv-dark-800 dark:text-white py-2 border-b border-mv-dark-100 dark:border-white/5">Découvrir</a>
          <a routerLink="/search" [queryParams]="{type: 'series'}" (click)="toggleMobileMenu()" class="text-xl font-bebas text-mv-dark-800 dark:text-white py-2 border-b border-mv-dark-100 dark:border-white/5">Séries</a>
          <a routerLink="/favorites" (click)="toggleMobileMenu()" class="text-xl font-bebas text-mv-dark-800 dark:text-white py-2 border-b border-mv-dark-100 dark:border-white/5 flex justify-between items-center">
            Favoris
            <span *ngIf="favCount() > 0" class="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-mv-red-500 text-xs font-bold text-white px-1">{{ favCount() }}</span>
          </a>
          <button (click)="theme.toggle(); toggleMobileMenu()" class="text-xl font-bebas text-mv-dark-800 dark:text-white py-2 text-left flex justify-between items-center">
            Mode {{ theme.isDark() ? 'Clair' : 'Sombre' }}
            <svg *ngIf="!theme.isDark()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg *ngIf="theme.isDark()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Search Overlay Modal -->
      <div *ngIf="searchState.isSearchModalOpen()" class="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-mv-dark-900/80 backdrop-blur-md" (click)="closeSearch($event)" id="search-overlay">
        <div class="bg-white dark:bg-mv-dark-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-mv-dark-200 dark:border-white/10 overflow-hidden" (click)="$event.stopPropagation()">
          <div class="p-4 border-b border-mv-dark-100 dark:border-white/5 flex items-center gap-3 relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-mv-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" #searchInput (keyup.enter)="goToSearch(searchInput.value)" placeholder="Rechercher (Appuyez sur Entrée...)" class="w-full bg-transparent border-none outline-none text-xl text-mv-dark-800 dark:text-white" autofocus>
            <button (click)="searchState.close()" class="p-1 rounded-md text-mv-dark-400 hover:bg-mv-dark-100 dark:hover:bg-white/5 transition-colors absolute right-4">
              <span class="text-xs border border-mv-dark-200 dark:border-white/20 rounded px-1.5 py-0.5">ESC</span>
            </button>
          </div>
          <div class="p-4 bg-mv-dark-50 dark:bg-mv-dark-900/50">
            <p class="text-xs text-center text-mv-dark-500 dark:text-mv-dark-400">Appuyez sur Entrée pour rechercher dans le catalogue complet</p>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <main>
        <app-breadcrumb></app-breadcrumb>
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <footer class="border-t border-mv-dark-200 dark:border-white/[0.05] py-10 mt-auto bg-white dark:bg-mv-dark-800 text-center text-mv-dark-500 dark:text-mv-dark-400">
        <p class="font-bebas text-2xl mb-2"><span class="text-mv-red-500">M</span>OVIFLIX</p>
        <p class="text-sm">© 2026 Moviflix. Données fournies par OMDb API.</p>
      </footer>
    </div>
  `,
  styles: [`
    .active-link {
      @apply bg-mv-red-500/15 text-mv-red-600 dark:text-mv-red-400 rounded-full;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 2px;
      left: 1rem;
      right: 1rem;
      height: 2px;
      background-color: theme('colors.mv.red.500');
      transform: scaleX(0);
      transition: transform 0.2s ease-in-out;
    }
    .nav-link:hover::after {
      transform: scaleX(1);
    }
    .active-link::after {
      display: none;
    }
  `]
})
export class AppComponent {
  theme = inject(ThemeService);
  searchState = inject(SearchStateService);
  favorites = inject(FavoritesService);
  private router = inject(Router);
  
  isScrolled = false;
  isMobileMenuOpen = false;

  get favCount() {
    return () => this.favorites.getAll().length;
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  openSearch() {
    this.searchState.open();
    setTimeout(() => {
      const input = document.querySelector('input[autofocus]') as HTMLInputElement;
      if (input) input.focus();
    }, 100);
  }

  closeSearch(event: Event) {
    if ((event.target as HTMLElement).id === 'search-overlay') {
      this.searchState.close();
    }
  }

  goToSearch(query: string) {
    if (query.trim()) {
      this.searchState.close();
      this.router.navigate(['/search'], { queryParams: { q: query.trim() } });
    }
  }
}
