import { RatingsService } from '../features/ratings/ratings.service';

describe('RatingsService', () => {
  let service: RatingsService;
  let mockRatingsRepo: any;
  let mockMoviesRepo: any;
  let mockCache: any;

  beforeEach(() => {
    mockRatingsRepo = {
      upsert: jest.fn().mockResolvedValue(true),
      findByMovie: jest.fn().mockResolvedValue([{ userId: 'u1', score: 8 }])
    };
    mockMoviesRepo = {
      updateAggregates: jest.fn().mockResolvedValue({ avg: 8, count: 10 }),
      findAggregates: jest.fn().mockResolvedValue({ avg: 8, count: 10 })
    };
    mockCache = {
      del: jest.fn().mockResolvedValue(true)
    };
    service = new RatingsService(mockRatingsRepo, mockMoviesRepo, mockCache);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should rate a movie and update aggregates', async () => {
    const result = await service.rate('u1', 'm1', 8);
    expect(mockRatingsRepo.upsert).toHaveBeenCalledWith('u1', 'm1', 8);
    expect(mockMoviesRepo.updateAggregates).toHaveBeenCalledWith('m1');
    expect(mockCache.del).toHaveBeenCalled();
    expect(result).toEqual({ movieId: 'm1', avg_rating: 8, rating_count: 10 });
  });

  it('should get movie ratings and aggregates', async () => {
    const result = await service.getMovieRatings('m1');
    expect(mockRatingsRepo.findByMovie).toHaveBeenCalledWith('m1');
    expect(mockMoviesRepo.findAggregates).toHaveBeenCalledWith('m1');
    expect(result).toEqual({ movieId: 'm1', avg_rating: 8, rating_count: 10, ratings: [{ userId: 'u1', score: 8 }] });
  });
});
