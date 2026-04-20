export interface Rating {
  Source: string;
  Value: string;
}

// Search item from OMDB (?s=)
export interface SearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

// Complete movie payload from OMDB (?i= / ?t=)
export interface Movie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  totalSeasons?: string;
  Response: string;
  Error?: string;
}

export interface SearchResponse {
  Search: SearchResult[];
  totalResults: string;
  Response: string;
  Error?: string;
}

// Backward-compatible aliases used in current app
export type MovieSearchResult = SearchResult;
export type MovieDetail = Movie;
