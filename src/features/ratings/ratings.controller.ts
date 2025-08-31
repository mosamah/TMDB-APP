import { Controller, Post, Body, Param, Req, UseGuards, Get } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Ratings')
@ApiBearerAuth('JWT-auth')
@Controller('api/movies/:id/ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly service: RatingsService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        score: { type: 'integer', minimum: 1, maximum: 10 },
      },
      required: ['score'],
    },
  })
  rate(
    @Param('id') movieId: string,
    @Req() req: any,
    @Body() dto: CreateRatingDto,
  ) {
    const userId = req.user.userId;
    return this.service.rate(userId, movieId, dto.score);
  }

  @Get()
  @ApiParam({ name: 'id', type: String, description: 'Movie ID' })
  async getRatings(@Param('id') movieId: string) {
    return this.service.getMovieRatings(movieId);
  }
}
