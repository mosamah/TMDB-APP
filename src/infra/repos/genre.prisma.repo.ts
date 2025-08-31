import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { GenreRepository } from '../../domain/ports';

@Injectable()
export class GenrePrismaRepository implements GenreRepository {
  constructor(private readonly prisma: PrismaService) {}
  all() { return this.prisma.genre.findMany({ orderBy: { name: 'asc' } }); }
  async upsert(tmdbId: number, name: string) {
    await this.prisma.genre.upsert({ where: { tmdbId }, update: { name }, create: { tmdbId, name } });
  }
}
