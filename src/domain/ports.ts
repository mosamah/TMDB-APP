import { Movie } from './models';

export type MovieListQuery = {
  q?: string; genreId?: number; page?: number; limit?: number;
  sort?: 'popularity'|'release_date'|'avg_rating'; order?: 'asc'|'desc';
};

export interface MovieRepository {
  list(query: MovieListQuery): Promise<{ items: Movie[]; total: number }>;
  findById(id: string): Promise<Movie | null>;
  upsertFromTmdb(payload: any): Promise<void>;
  updateAggregates(movieId: string): Promise<{ avg: number; count: number }>;
}

export interface RatingRepository {
  upsert(userId: string, movieId: string, score: number): Promise<void>;
}

export interface GenreRepository {
  all(): Promise<{ id: number; name: string; tmdbId: number }[]>;
  upsert(tmdbId: number, name: string): Promise<void>;
}
