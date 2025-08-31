import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { RatingRepository } from '../../domain/ports';

@Injectable()
export class RatingPrismaRepository implements RatingRepository {
  constructor(private readonly prisma: PrismaService) {}
  async upsert(userId: string, movieId: string, score: number) {
    await this.prisma.rating.upsert({
      where: { userId_movieId: { userId, movieId } },
      update: { score },
      create: { userId, movieId, score },
    });
  }

  async findUserRating(userId: string, movieId: string) {
    return this.prisma.rating.findUnique({
      where: { userId_movieId: { userId, movieId } },
    });
  }

  async findMovieRatings(movieId: string) {
    return this.prisma.rating.findMany({
      where: { movieId },
    });
  }

  async findByMovie(movieId: string) {
    return this.prisma.rating.findMany({
      where: { movieId },
      select: {
        userId: true,
        score: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
