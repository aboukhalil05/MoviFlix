import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchStateService {
  isSearchModalOpen = signal(false);
  toggle() { this.isSearchModalOpen.update(v => !v); }
  open() { this.isSearchModalOpen.set(true); }
  close() { this.isSearchModalOpen.set(false); }
}
