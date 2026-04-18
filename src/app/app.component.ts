import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ThemeService } from './services/theme.service';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, LoadingScreenComponent],
  template: `
    @if (isBootLoading) {
      <app-loading-screen></app-loading-screen>
    } @else {
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    }
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - 64px);
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  isBootLoading = true;
  private bootTimeoutId?: ReturnType<typeof setTimeout>;

  // ThemeService is injected here so it initialises on app start
  // and applies the saved/preferred theme immediately.
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.bootTimeoutId = setTimeout(() => {
      this.isBootLoading = false;
    }, 1600);
  }

  ngOnDestroy(): void {
    if (this.bootTimeoutId) {
      clearTimeout(this.bootTimeoutId);
    }
  }
}
