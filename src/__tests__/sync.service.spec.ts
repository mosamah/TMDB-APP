import { SyncService } from '../features/sync/sync.service';

describe('SyncService', () => {
  let service: SyncService;
  let mockTmdbService: any;
  let mockGenreRepo: any;
  let mockMovieRepo: any;

  beforeEach(() => {
    mockTmdbService = {
      getGenres: jest.fn().mockResolvedValue([{ id: 1, name: 'Action' }]),
      getPopular: jest.fn().mockResolvedValue({ results: [{ id: 101, title: 'Movie1' }] })
    };
    mockGenreRepo = {
      upsert: jest.fn().mockResolvedValue(true)
    };
    mockMovieRepo = {
      upsertFromTmdb: jest.fn().mockResolvedValue(true)
    };
    service = new SyncService(mockTmdbService, mockGenreRepo, mockMovieRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sync genres from TMDB', async () => {
    await service.syncGenres();
    expect(mockTmdbService.getGenres).toHaveBeenCalled();
    expect(mockGenreRepo.upsert).toHaveBeenCalledWith(1, 'Action');
  });

  it('should sync popular movies from TMDB', async () => {
    await service.syncPopular(1);
    expect(mockTmdbService.getPopular).toHaveBeenCalledWith(1);
    expect(mockMovieRepo.upsertFromTmdb).toHaveBeenCalledWith({ id: 101, title: 'Movie1' });
  });

  it('should run scheduled job and call sync methods', async () => {
    const spyGenres = jest.spyOn(service, 'syncGenres');
    const spyPopular = jest.spyOn(service, 'syncPopular');
    await service.scheduled();
    expect(spyGenres).toHaveBeenCalled();
    expect(spyPopular).toHaveBeenCalled();
  });
});
