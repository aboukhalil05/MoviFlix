import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { MovieService } from '../../services/movie.service';
import { MovieSearchResult } from '../../models/movie.model';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TruncatePipe],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  query = '';
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
    // Subscribe to debounced input (300ms delay)
    this.searchSubject.pipe(
      debounceTime(300),
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
      if (params['q']) {
        this.query = params['q'];
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
    this.router.navigate([], { queryParams: { q: this.query }, replaceUrl: true });
  }

  onKeyEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.onSearch();
  }

  fetchMovies(): void {
    if (!this.query.trim()) return;
    this.loading = true;
    this.error = '';

    this.movieService.searchMovies(this.query, this.currentPage).subscribe({
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

  getPosterUrl(poster: string): string {
    return poster && poster !== 'N/A' ? poster : 'assets/no-poster.png';
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
