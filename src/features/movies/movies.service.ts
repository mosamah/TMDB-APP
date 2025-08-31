import { Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MoviePrismaRepository } from '../../infra/repos/movie.prisma.repo';
import { movieDetailKey, movieListKey } from '../../common/cache-keys';
import { ListMoviesDto } from './dto/list-movies.dto';
import { toPageResult } from '../../common/pagination';

@Injectable()
export class MoviesService {
  constructor(
    private readonly movies: MoviePrismaRepository,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async list(q: ListMoviesDto) {
    const key = movieListKey(q);
    const cached = await this.cache.get(key);
    if (cached) return cached;
    const { items, total } = await this.movies.list(q);
    const res = toPageResult(items, total, q.page, q.limit);
    await this.cache.set(key, res, 60);
    return res;
  }

  async detail(id: string) {
    const key = movieDetailKey(id);
    const cached = await this.cache.get(key);
    if (cached) return cached;
    const movie = await this.movies.findById(id);
    if (!movie) return null;
    await this.cache.set(key, movie, 300);
    return movie;
  }
}
