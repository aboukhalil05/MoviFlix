import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { ThemeService } from '../../services/theme.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroBars3, heroMagnifyingGlass, heroMoon, heroSun } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, NgIcon],
  providers: [provideIcons({ heroSun, heroMoon, heroBars3, heroMagnifyingGlass })],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  favCount = 0;

  constructor(
    private movieService: MovieService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.favCount = this.movieService.getFavorites().length;
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  refreshCount(): void {
    this.favCount = this.movieService.getFavorites().length;
  }
}
