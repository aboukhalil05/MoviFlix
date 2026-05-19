import { Directive, HostListener, inject } from '@angular/core';
import { SearchStateService } from '../services/search-state.service';

@Directive({
  selector: '[appSearchShortcut]',
  standalone: true
})
export class SearchShortcutDirective {
  private searchState = inject(SearchStateService);

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.searchState.open();
    }
    if (event.key === '/') {
      const target = event.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        event.preventDefault();
        this.searchState.open();
      }
    }
    if (event.key === 'Escape') {
      this.searchState.close();
    }
  }
}
