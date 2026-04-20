import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { MovieService } from '../../services/movie.service';
import { MovieSearchResult } from '../../models/movie.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCardComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  query = '';
  selectedType = '';
  year = '';
  readonly typeOptions = [
    { label: 'Tous', value: '' },
    { label: 'Films', value: 'movie' },
    { label: 'Séries', value: 'series' },
    { label: 'Épisodes', value: 'episode' }
  ];
  results: MovieSearchResult[] = [];
  loading = false;
  error = '';
  totalResults = 0;
  currentPage = 1;
  totalPages = 1;

  // Debounce search with RxJS Subject
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to debounced input (500ms delay)
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(q => {
      if (q.trim().length >= 2) {
        this.currentPage = 1;
        this.fetchMovies();
      }
    });

    // Pick up ?q= from URL (coming from home page quick search)
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.query = params['q'] || '';
      this.selectedType = params['type'] || '';
      this.year = params['year'] || '';

      if (this.query) {
        this.currentPage = 1;
        this.fetchMovies();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Called on every keystroke — feeds the debounce subject */
  onInputChange(): void {
    this.searchSubject.next(this.query);
  }

  /** Called by button click or Enter key */
  onSearch(): void {
    if (!this.query.trim()) return;
    this.currentPage = 1;
    this.fetchMovies();
    this.updateQueryParams();
  }

  onKeyEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.onSearch();
  }

  fetchMovies(): void {
    if (!this.query.trim()) return;
    this.loading = true;
    this.error = '';

    this.movieService.searchMovies(this.query, this.currentPage, this.selectedType, this.year).subscribe({
      next: res => {
        this.loading = false;
        if (res.Response === 'True') {
          this.results = res.Search;
          this.totalResults = parseInt(res.totalResults, 10);
          this.totalPages = Math.ceil(this.totalResults / 10);
        } else {
          this.results = [];
          this.error = res.Error || 'No results found.';
        }
      },
      error: err => {
        this.loading = false;
        this.error = err.message || 'Something went wrong.';
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchMovies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onTypeChange(type: string): void {
    if (this.selectedType === type) return;
    this.selectedType = type;
    this.currentPage = 1;
    this.performFilteredSearch();
  }

  onYearChange(): void {
    this.year = this.year.replace(/\D/g, '').slice(0, 4);
    this.currentPage = 1;
    this.performFilteredSearch();
  }

  clearSearch(): void {
    this.query = '';
    this.results = [];
    this.error = '';
    this.totalResults = 0;
    this.currentPage = 1;
    this.totalPages = 1;
    this.router.navigate([], {
      queryParams: { q: null, type: this.selectedType || null, year: this.year || null },
      replaceUrl: true
    });
  }

  private performFilteredSearch(): void {
    if (!this.query.trim()) return;
    this.fetchMovies();
    this.updateQueryParams();
  }

  private updateQueryParams(): void {
    this.router.navigate([], {
      queryParams: {
        q: this.query,
        type: this.selectedType || null,
        year: this.year || null
      },
      replaceUrl: true
    });
  }

  isFavorite(id: string): boolean {
    return this.movieService.isFavorite(id);
  }

  toggleFavorite(event: Event, movie: MovieSearchResult): void {
    event.preventDefault();    // Don't navigate to details
    event.stopPropagation();
    this.movieService.toggleFavorite(movie);
  }

  /** Array of page numbers to display in paginator */
  get pageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end   = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }
}
