import { MoviesService } from '../features/movies/movies.service';
import { movieListKey, movieDetailKey } from '../common/cache-keys';
import { toPageResult } from '../common/pagination';

describe('MoviesService', () => {
  let service: MoviesService;
  let mockMoviesRepo: any;
  let mockCache: any;

  beforeEach(() => {
    mockMoviesRepo = {
      list: jest.fn().mockResolvedValue({
        items: [{ id: 'm1', title: 'Inception' }],
        total: 1,
      }),
      findById: jest.fn().mockResolvedValue({ id: 'm1', title: 'Inception' }),
    };

    mockCache = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(true),
    };

    service = new MoviesService(mockMoviesRepo, mockCache);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('list', () => {
    it('should return cached result if exists', async () => {
      const q = { page: 1, limit: 10, sort: 'title', order: 'asc' };
      const cachedResult = { items: [{ id: 'mCached', title: 'Cached' }], total: 1 };

      mockCache.get.mockResolvedValueOnce(cachedResult);

      const result = await service.list(q);

      expect(mockCache.get).toHaveBeenCalledWith(movieListKey(q));
      expect(result).toEqual(cachedResult);
      expect(mockMoviesRepo.list).not.toHaveBeenCalled();
    });

    it('should fetch, paginate, cache, and return movies if no cache', async () => {
      const q = { page: 1, limit: 10, sort: 'title', order: 'asc' };

      const expected = toPageResult(
        [{ id: 'm1', title: 'Inception' }],
        1,
        q.page,
        q.limit,
      );

      const result = await service.list(q);

      expect(mockMoviesRepo.list).toHaveBeenCalledWith(q);
      expect(mockCache.set).toHaveBeenCalledWith(movieListKey(q), expected, 60);
      expect(result).toEqual(expected);
    });
  });

  describe('detail', () => {
    it('should return cached movie if exists', async () => {
      const cachedMovie = { id: 'mCached', title: 'Cached Movie' };

      mockCache.get.mockResolvedValueOnce(cachedMovie);

      const result = await service.detail('mCached');

      expect(mockCache.get).toHaveBeenCalledWith(movieDetailKey('mCached'));
      expect(result).toEqual(cachedMovie);
      expect(mockMoviesRepo.findById).not.toHaveBeenCalled();
    });

    it('should fetch, cache, and return movie if not cached', async () => {
      const result = await service.detail('m1');

      expect(mockMoviesRepo.findById).toHaveBeenCalledWith('m1');
      expect(mockCache.set).toHaveBeenCalledWith(
        movieDetailKey('m1'),
        { id: 'm1', title: 'Inception' },
        300,
      );
      expect(result).toEqual({ id: 'm1', title: 'Inception' });
    });

    it('should return null if movie not found', async () => {
      mockMoviesRepo.findById.mockResolvedValueOnce(null);

      const result = await service.detail('m404');

      expect(mockMoviesRepo.findById).toHaveBeenCalledWith('m404');
      expect(result).toBeNull();
    });
  });
});
