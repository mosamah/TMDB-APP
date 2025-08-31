import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { GenrePrismaRepository } from '../../infra/repos/genre.prisma.repo';

@Module({ controllers: [GenresController], providers: [GenrePrismaRepository] })
export class GenresModule {}
