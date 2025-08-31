import { Controller, Get, Post, Delete, Body, Req, UseGuards } from '@nestjs/common';
import { ListsService } from './lists.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Lists')
@ApiBearerAuth('JWT-auth')  
@Controller('lists')
@UseGuards(JwtAuthGuard)
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get('watchlist')
  getWatchlist(@Req() req: any) {
    const userId = req.user.userId;
    return this.listsService.getWatchlist(userId);
  }

  @Post('watchlist')
  @ApiBody({ schema: { type: 'object', properties: { movieId: { type: 'string' } } } })
  addToWatchlist(@Req() req: any, @Body() body: { movieId: string }) {
    const userId = req.user.userId;
    return this.listsService.addToWatchlist(userId, body.movieId);
  }

  @Delete('watchlist')
  @ApiBody({ schema: { type: 'object', properties: { movieId: { type: 'string' } } } })
  removeFromWatchlist(@Req() req: any, @Body() body: { movieId: string }) {
    const userId = req.user.userId;
    return this.listsService.removeFromWatchlist(userId, body.movieId);
  }

  @Get('favorites')
  getFavorites(@Req() req: any) {
    const userId = req.user.userId;
    return this.listsService.getFavorites(userId);
  }

  @Post('favorites')
  @ApiBody({ schema: { type: 'object', properties: { movieId: { type: 'string' } } } })
  addToFavorites(@Req() req: any, @Body() body: { movieId: string }) {
    const userId = req.user.userId;
    return this.listsService.addToFavorites(userId, body.movieId);
  }

  @Delete('favorites')
  @ApiBody({ schema: { type: 'object', properties: { movieId: { type: 'string' } } } })
  removeFromFavorites(@Req() req: any, @Body() body: { movieId: string }) {
    const userId = req.user.userId;
    return this.listsService.removeFromFavorites(userId, body.movieId);
  }
}
