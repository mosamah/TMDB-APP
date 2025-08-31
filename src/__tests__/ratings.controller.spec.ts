import { RatingsController } from '../features/ratings/ratings.controller';

describe('RatingsController', () => {
  let controller: RatingsController;
  let mockRatingsService: any;

  beforeEach(() => {
    mockRatingsService = {
      rate: jest.fn().mockResolvedValue({ movieId: 'm1', avg_rating: 8, rating_count: 10 }),
      getMovieRatings: jest.fn().mockResolvedValue({ movieId: 'm1', avg_rating: 8, rating_count: 10, ratings: [{ userId: 'u1', score: 8 }] })
    };
    controller = new RatingsController(mockRatingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should rate a movie', async () => {
    const result = await controller.rate('m1', { user: { userId: 'u1' } }, { score: 8 });
    expect(result).toEqual({ movieId: 'm1', avg_rating: 8, rating_count: 10 });
    expect(mockRatingsService.rate).toHaveBeenCalledWith('u1', 'm1', 8);
  });

  it('should get ratings for a movie', async () => {
    const result = await controller.getRatings('m1');
    expect(result).toEqual({ movieId: 'm1', avg_rating: 8, rating_count: 10, ratings: [{ userId: 'u1', score: 8 }] });
    expect(mockRatingsService.getMovieRatings).toHaveBeenCalledWith('m1');
  });
});
