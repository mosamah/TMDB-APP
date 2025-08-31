import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MoviePrismaRepository } from '../../infra/repos/movie.prisma.repo';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService, MoviePrismaRepository],
})
export class MoviesModule {}
