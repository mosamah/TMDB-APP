import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { TmdbService } from '../tmdb/tmdb.service';
import { GenrePrismaRepository } from '../../infra/repos/genre.prisma.repo';
import { MoviePrismaRepository } from '../../infra/repos/movie.prisma.repo';

@Module({
  controllers: [SyncController],
  providers: [SyncService, TmdbService, GenrePrismaRepository, MoviePrismaRepository],
})
export class SyncModule {}
