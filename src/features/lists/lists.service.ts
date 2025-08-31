import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class ListsService {
  constructor(private readonly prisma: PrismaService) {}

  async getWatchlist(userId: string) {
    return this.prisma.watchlist.findMany({
      where: { userId },
      include: { movie: true },
    });
  }

  async addToWatchlist(userId: string, movieId: string) {
    return this.prisma.watchlist.create({
      data: { userId, movieId },
    });
  }

  async removeFromWatchlist(userId: string, movieId: string) {
    return this.prisma.watchlist.delete({
      where: { userId_movieId: { userId, movieId } },
    });
  }

  async getFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { movie: true },
    });
  }

  async addToFavorites(userId: string, movieId: string) {
    return this.prisma.favorite.create({
      data: { userId, movieId },
    });
  }

  async removeFromFavorites(userId: string, movieId: string) {
    return this.prisma.favorite.delete({
      where: { userId_movieId: { userId, movieId } },
    });
  }
}
