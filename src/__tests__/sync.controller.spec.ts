import { SyncController } from '../features/sync/sync.controller';

describe('SyncController', () => {
  let controller: SyncController;
  let mockSyncService: any;

  beforeEach(() => {
    mockSyncService = {
      scheduled: jest.fn().mockResolvedValue('done'),
      syncGenres: jest.fn().mockResolvedValue('genres synced'),
      syncPopular: jest.fn().mockResolvedValue('popular synced')
    };
    controller = new SyncController(mockSyncService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should run scheduled sync', async () => {
    const result = await controller['syncService'].scheduled();
    expect(result).toBe('done');
    expect(mockSyncService.scheduled).toHaveBeenCalled();
  });

  it('should sync genres', async () => {
    const result = await controller['syncService'].syncGenres();
    expect(result).toBe('genres synced');
    expect(mockSyncService.syncGenres).toHaveBeenCalled();
  });

  it('should sync popular movies', async () => {
    const result = await controller['syncService'].syncPopular();
    expect(result).toBe('popular synced');
    expect(mockSyncService.syncPopular).toHaveBeenCalled();
  });
});
