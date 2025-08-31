import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TmdbService } from '../tmdb/tmdb.service';
import { GenrePrismaRepository } from '../../infra/repos/genre.prisma.repo';
import { MoviePrismaRepository } from '../../infra/repos/movie.prisma.repo';

@Injectable()
export class SyncService {
  private readonly log = new Logger(SyncService.name);
  constructor(
    private readonly tmdb: TmdbService,
    private readonly genres: GenrePrismaRepository,
    private readonly movies: MoviePrismaRepository,
  ) {}

  async syncGenres() {
    const genres = await this.tmdb.getGenres();
    await Promise.all(genres.map((g: any) => this.genres.upsert(g.id, g.name)));
  }

  async syncPopular(pages = Number(process.env.SEED_PAGES || 3)) {
    for (let p = 1; p <= pages; p++) {
      const data = await this.tmdb.getPopular(p);
      for (const m of data.results) await this.movies.upsertFromTmdb(m);
    }
  }

  @Cron(process.env.SYNC_CRON || '0 3 * * *')
  async scheduled() {
    this.log.log('Running scheduled TMDB sync');
    await this.syncGenres();
    await this.syncPopular();
    this.log.log('TMDB sync done');
  }
}
