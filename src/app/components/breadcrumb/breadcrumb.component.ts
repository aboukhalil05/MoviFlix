import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div 
      class="fixed top-24 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 pointer-events-none"
      [class.opacity-0]="isHidden()"
      [class.-translate-y-4]="isHidden()">
      <div class="bg-white/90 dark:bg-mv-dark-800/90 backdrop-blur-md px-5 py-2 rounded-full border border-mv-dark-200 dark:border-white/[0.06] shadow-lg pointer-events-auto flex items-center gap-2 text-sm font-medium text-mv-dark-500 dark:text-mv-dark-300" *ngIf="paths().length > 0">
        <a routerLink="/" class="hover:text-mv-red-500 transition-colors cursor-pointer">Accueil</a>
        <span>›</span>
        <ng-container *ngFor="let path of paths(); let last = last">
          <a *ngIf="!last" [routerLink]="path.url" class="hover:text-mv-red-500 transition-colors cursor-pointer">{{ path.label }}</a>
          <span *ngIf="last" class="text-mv-dark-800 dark:text-mv-dark-50">{{ path.label }}</span>
          <span *ngIf="!last">›</span>
        </ng-container>
      </div>
    </div>
  `
})
export class BreadcrumbComponent {
  isHidden = signal(false);
  paths = signal<{label: string, url: string}[]>([]);
  private lastScrollY = 0;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.buildPaths(event.urlAfterRedirects);
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > this.lastScrollY && currentScroll > 100) {
      this.isHidden.set(true); // scrolling down
    } else {
      this.isHidden.set(false); // scrolling up
    }
    this.lastScrollY = currentScroll;
  }

  private buildPaths(url: string) {
    const segments = url.split('/').filter(s => s);
    const newPaths = [];
    if (segments.length === 0) {
      this.paths.set([]);
      return;
    }
    
    if (segments[0].startsWith('search')) {
      newPaths.push({ label: 'Recherche', url: '/search' });
    } else if (segments[0] === 'movie') {
      newPaths.push({ label: 'Film', url: url });
    } else if (segments[0] === 'favorites') {
      newPaths.push({ label: 'Favoris', url: '/favorites' });
    }
    this.paths.set(newPaths);
  }
}
