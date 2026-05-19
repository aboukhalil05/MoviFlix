import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
      <div *ngFor="let i of [].constructor(count)" 
           class="rounded-lg bg-mv-dark-200 dark:bg-mv-dark-700 border border-mv-dark-200 dark:border-white/[0.08] overflow-hidden animate-pulse">
        <div class="w-full h-[300px] md:h-[400px] bg-mv-dark-300 dark:bg-mv-dark-600"></div>
        <div class="p-4">
          <div class="h-4 bg-mv-dark-300 dark:bg-mv-dark-600 rounded w-3/4 mb-3"></div>
          <div class="h-3 bg-mv-dark-300 dark:bg-mv-dark-600 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  `
})
export class SkeletonLoaderComponent {
  @Input() count: number = 5;
}
