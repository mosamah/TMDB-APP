import { Controller, Post, Logger } from '@nestjs/common';
import { SyncService } from './sync.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Sync')
@Controller('api/sync')
export class SyncController {
  private readonly log = new Logger(SyncController.name);

  constructor(private readonly syncService: SyncService) {}

  @Post('genres')
  async syncGenres() {
    this.log.log('Manual sync of genres started');
    await this.syncService.syncGenres();
    return { message: 'Genres synced successfully' };
  }

  @Post('popular')
  async syncPopular() {
    this.log.log('Manual sync of popular movies started');
    await this.syncService.syncPopular();
    return { message: 'Popular movies synced successfully' };
  }

  @Post()
  async fullSync() {
    this.log.log('Manual full sync started');
    await this.syncService.syncGenres();
    await this.syncService.syncPopular();
    return { message: 'Full TMDB sync done' };
  }
}
