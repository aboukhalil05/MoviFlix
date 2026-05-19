import { Directive, ElementRef, HostListener, Input, inject, Renderer2, OnDestroy } from '@angular/core';
import { OmdbService } from '../services/omdb.service';

@Directive({
  selector: '[appMoviePreview]',
  standalone: true
})
export class MoviePreviewDirective implements OnDestroy {
  @Input('appMoviePreview') imdbID!: string;
  
  private omdb = inject(OmdbService);
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);
  
  private tooltipEl: HTMLElement | null = null;
  private hoverTimeout: any;

  @HostListener('mouseenter') onMouseEnter() {
    this.hoverTimeout = setTimeout(() => {
      this.showPreview();
    }, 400);
  }

  @HostListener('mouseleave') onMouseLeave() {
    clearTimeout(this.hoverTimeout);
    this.hidePreview();
  }

  ngOnDestroy() {
    this.hidePreview();
  }

  private showPreview() {
    if (this.tooltipEl || !this.imdbID) return;

    this.tooltipEl = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipEl, 'fixed');
    this.renderer.addClass(this.tooltipEl, 'z-[100]');
    this.renderer.addClass(this.tooltipEl, 'bg-mv-dark-800');
    this.renderer.addClass(this.tooltipEl, 'border');
    this.renderer.addClass(this.tooltipEl, 'border-white/[0.08]');
    this.renderer.addClass(this.tooltipEl, 'rounded-xl');
    this.renderer.addClass(this.tooltipEl, 'shadow-2xl');
    this.renderer.addClass(this.tooltipEl, 'w-72');
    this.renderer.addClass(this.tooltipEl, 'p-4');
    this.renderer.addClass(this.tooltipEl, 'text-sm');
    this.renderer.addClass(this.tooltipEl, 'text-mv-dark-50');
    this.renderer.addClass(this.tooltipEl, 'backdrop-blur-md');
    this.renderer.addClass(this.tooltipEl, 'bg-opacity-95');
    
    // Calculate position
    const rect = this.el.nativeElement.getBoundingClientRect();
    const isRightSide = window.innerWidth - rect.right < 300;
    
    if (isRightSide) {
      this.renderer.setStyle(this.tooltipEl, 'left', `${rect.left - 300}px`);
    } else {
      this.renderer.setStyle(this.tooltipEl, 'left', `${rect.right + 10}px`);
    }
    
    // Prevent going off bottom screen
    let topPos = rect.top;
    if (window.innerHeight - rect.top < 200) {
      topPos = window.innerHeight - 220;
    }
    this.renderer.setStyle(this.tooltipEl, 'top', `${Math.max(10, topPos)}px`);
    
    this.tooltipEl!.innerHTML = `<div class="animate-pulse flex items-center gap-2"><div class="w-4 h-4 rounded-full border-2 border-mv-red-500 border-t-transparent animate-spin"></div> Chargement...</div>`;
    this.renderer.appendChild(document.body, this.tooltipEl);

    this.omdb.getMovieById(this.imdbID).subscribe(movie => {
      if (this.tooltipEl && movie.Response === 'True') {
        this.tooltipEl.innerHTML = `
          <div class="flex items-start gap-3 mb-2">
            ${movie.Poster !== 'N/A' ? `<img src="${movie.Poster}" class="w-16 h-24 object-cover rounded shadow" />` : ''}
            <div>
              <h4 class="font-bebas text-xl text-white leading-tight">${movie.Title}</h4>
              <p class="text-xs text-mv-dark-300 mt-1">${movie.Year} • ${movie.Runtime}</p>
              <div class="mt-1 flex items-center gap-1 text-yellow-400 text-xs">★ ${movie.imdbRating}</div>
            </div>
          </div>
          <p class="text-xs text-mv-dark-100 mb-2 line-clamp-3 leading-relaxed">${movie.Plot}</p>
          <p class="text-[10px] text-mv-red-400 font-medium">Avec: <span class="text-mv-dark-300">${movie.Actors}</span></p>
        `;
      } else if (this.tooltipEl) {
        this.tooltipEl.innerHTML = `<div class="text-mv-red-400">Impossible de charger les détails.</div>`;
      }
    });
  }

  private hidePreview() {
    if (this.tooltipEl) {
      this.renderer.removeChild(document.body, this.tooltipEl);
      this.tooltipEl = null;
    }
  }
}
