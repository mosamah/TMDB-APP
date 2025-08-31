import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { PrismaModule } from './core/prisma/prisma.module';
import { TmdbModule } from './features/tmdb/tmdb.module';
import { SyncModule } from './features/sync/sync.module';
import { MoviesModule } from './features/movies/movies.module';
import { GenresModule } from './features/genres/genres.module';
import { RatingsModule } from './features/ratings/ratings.module';
import { ListsModule } from './features/lists/lists.module';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(8080),
        DATABASE_URL: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        TMDB_API_KEY: Joi.string().required(),
        TMDB_BASE_URL: Joi.string().default('https://api.themoviedb.org/3'),
        JWT_SECRET: Joi.string().required(),
        SEED_PAGES: Joi.number().default(3),
        SYNC_CRON: Joi.string().default('0 3 * * *'),
      }),
    }),
    ScheduleModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({ url: process.env.REDIS_URL }),
        ttl: 60,
      }),
    }),
    PrismaModule,
    TmdbModule,
    SyncModule,
    MoviesModule,
    GenresModule,
    RatingsModule,
    ListsModule,
    AuthModule,
  ],
})
export class AppModule {}
