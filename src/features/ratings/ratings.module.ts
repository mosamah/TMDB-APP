import { Module } from '@nestjs/common';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { RatingPrismaRepository } from '../../infra/repos/rating.prisma.repo';
import { MoviePrismaRepository } from '../../infra/repos/movie.prisma.repo';

@Module({
  controllers: [RatingsController],
  providers: [RatingsService, RatingPrismaRepository, MoviePrismaRepository],
})
export class RatingsModule {}
