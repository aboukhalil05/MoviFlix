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
  featured: MovieSearchResult[] = [];
  loading = false;

  // Curated featured movie IDs for the homepage showcase
  featuredIds = ['tt0816692', 'tt1375666', 'tt0468569', 'tt0110912', 'tt0137523'];

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.loadFeatured();
  }

  loadFeatured(): void {
    this.loading = true;
    // Search for "Interstellar" to get some results for featured section
    this.movieService.searchMovies('christopher nolan').subscribe({
      next: res => {
        if (res.Response === 'True') {
          this.featured = res.Search.slice(0, 6);
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
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
