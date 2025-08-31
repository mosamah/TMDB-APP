import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Movie, Genre } from '../../domain/models';
import { MovieRepository, MovieListQuery } from '../../domain/ports';
import { normalizePage } from '../../common/pagination';

@Injectable()
export class MoviePrismaRepository implements MovieRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(q: MovieListQuery) {
    const { page = 1, limit = 20, genreId, sort = 'popularity', order = 'desc', q: search } = q;
    const { skip } = normalizePage({ page, limit });

    const andFilters: any[] = [];

    if (search) {
      andFilters.push({
        title: {
          contains: search,
          mode: 'insensitive',
        },
      });
    }

    if (genreId) {
      andFilters.push({
        genres: {
          some: { id: Number(genreId) },
        },
      });
    }

    const where = andFilters.length > 0 ? { AND: andFilters } : {};

    const orderBy =
      sort === 'avg_rating'
        ? { avgRating: order }
        : sort === 'release_date'
        ? { releaseDate: order }
        : { popularity: order };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.movie.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { genres: true },
      }),
      this.prisma.movie.count({ where }),
    ]);

    const items = rows.map(
      (r) =>
        new Movie(
          r.id,
          r.tmdbId,
          r.title,
          r.overview ?? null,
          r.releaseDate ?? null,
          r.posterPath ?? null,
          r.popularity ?? null,
          r.avgRating,
          r.ratingCount,
          r.genres.map((g) => new Genre(g.id, g.name, g.tmdbId))
        )
    );

    return { items, total };
  }

  async findById(id: string) {
    const r = await this.prisma.movie.findUnique({
      where: { id },
      include: { genres: true },
    });
    if (!r) return null;
    return new Movie(
      r.id,
      r.tmdbId,
      r.title,
      r.overview ?? null,
      r.releaseDate ?? null,
      r.posterPath ?? null,
      r.popularity ?? null,
      r.avgRating,
      r.ratingCount,
      r.genres.map((g) => new Genre(g.id, g.name, g.tmdbId))
    );
  }

  async findByTmdbId(tmdbId: number) {
    return this.prisma.movie.findUnique({
      where: { tmdbId },
      include: { genres: true },
    });
  }

  async upsertFromTmdb(m: any) {
    const connect = (m.genre_ids ?? []).map((gid: number) => ({ tmdbId: gid }));
    await this.prisma.movie.upsert({
      where: { tmdbId: m.id },
      update: {
        title: m.title,
        overview: m.overview,
        releaseDate: m.release_date ? new Date(m.release_date) : null,
        posterPath: m.poster_path,
        popularity: m.popularity,
        tmdbVoteAverage: m.vote_average,
        genres: { set: [], connect },
      },
      create: {
        tmdbId: m.id,
        title: m.title,
        overview: m.overview,
        releaseDate: m.release_date ? new Date(m.release_date) : null,
        posterPath: m.poster_path,
        popularity: m.popularity,
        tmdbVoteAverage: m.vote_average,
        genres: { connect },
      },
    });
  }

  async updateAggregates(movieId: string) {
    const agg = await this.prisma.rating.aggregate({
      where: { movieId },
      _avg: { score: true },
      _count: { score: true },
    });
    const avg = Number(agg._avg.score ?? 0);
    const count = Number(agg._count.score ?? 0);
    await this.prisma.movie.update({
      where: { id: movieId },
      data: { avgRating: avg, ratingCount: count },
    });
    return { avg, count };
  }

  async getRatings(movieId: string) {
    return this.prisma.rating.findMany({
      where: { movieId },
      include: { user: true },
    });
  }

    async findAggregates(movieId: string) {
    const agg = await this.prisma.rating.aggregate({
      _avg: { score: true },
      _count: { score: true },
      where: { movieId },
    });

    return {
      avg: agg._avg.score ?? 0,
      count: agg._count.score,
    };
  }
}
