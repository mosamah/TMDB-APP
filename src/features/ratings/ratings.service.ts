import { Injectable, Inject } from '@nestjs/common';
import { RatingPrismaRepository } from '../../infra/repos/rating.prisma.repo';
import { MoviePrismaRepository } from '../../infra/repos/movie.prisma.repo';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { movieDetailKey } from '../../common/cache-keys';

@Injectable()
export class RatingsService {
  constructor(
    private readonly ratings: RatingPrismaRepository,
    private readonly movies: MoviePrismaRepository,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async rate(userId: string, movieId: string, score: number) {
    await this.ratings.upsert(userId, movieId, score);
    const agg = await this.movies.updateAggregates(movieId);
    await this.cache.del(movieDetailKey(movieId));
    return { movieId, avg_rating: agg.avg, rating_count: agg.count };
  }

  async getMovieRatings(movieId: string) {
    const ratings = await this.ratings.findByMovie(movieId);
    const agg = await this.movies.findAggregates(movieId);

    return {
      movieId,
      avg_rating: agg.avg,
      rating_count: agg.count,
      ratings, // array of { userId, score, createdAt }
    };
  }
}
