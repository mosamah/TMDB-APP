import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ListMoviesDto } from './dto/list-movies.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Movies')
@Controller('api/movies')
export class MoviesController {
  constructor(private readonly service: MoviesService) {}

  @Get()
  list(@Query() q: ListMoviesDto) {
    return this.service.list(q);
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const m = await this.service.detail(id);
    if (!m) throw new NotFoundException('Movie not found');
    return m;
  }
}
