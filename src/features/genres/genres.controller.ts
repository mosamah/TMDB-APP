import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { genresAllKey } from '../../common/cache-keys';
import { GenrePrismaRepository } from '../../infra/repos/genre.prisma.repo';

@ApiTags('Genres')
@Controller('api/genres')
export class GenresController {
  constructor(
    private readonly genres: GenrePrismaRepository,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  @Get()
  async list() {
    const key = genresAllKey;
    const cached = await this.cache.get(key);
    if (cached) return cached;
    const res = await this.genres.all();
    await this.cache.set(key, res, 3600);
    return res;
  }
}
