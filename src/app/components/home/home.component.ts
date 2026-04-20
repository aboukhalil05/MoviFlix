import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { MovieSearchResult } from '../../models/movie.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  quickSearch = '';
  marvelMovies: MovieSearchResult[] = [];
  nolanMovies: MovieSearchResult[] = [];
  actionMovies: MovieSearchResult[] = [];
  loading = false;

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.loadSections();
  }

  loadSections(): void {
    this.loading = true;

    let completed = 0;
    const markDone = () => {
      completed += 1;
      if (completed === 3) this.loading = false;
    };

    this.movieService.searchMovies('marvel', 1, 'movie').subscribe({
      next: res => {
        if (res.Response === 'True') {
          this.marvelMovies = res.Search.slice(0, 10);
        }
        markDone();
      },
      error: () => { markDone(); }
    });

    this.movieService.searchMovies('christopher nolan', 1, 'movie').subscribe({
      next: res => {
        if (res.Response === 'True') {
          this.nolanMovies = res.Search.slice(0, 10);
        }
        markDone();
      },
      error: () => { markDone(); }
    });

    this.movieService.searchMovies('action', 1, 'movie').subscribe({
      next: res => {
        if (res.Response === 'True') {
          this.actionMovies = res.Search.slice(0, 10);
        }
        markDone();
      },
      error: () => { markDone(); }
    });
  }

  onQuickSearch(): void {
    if (this.quickSearch.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.quickSearch.trim() } });
    }
  }

  onKeyEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.onQuickSearch();
  }
}
