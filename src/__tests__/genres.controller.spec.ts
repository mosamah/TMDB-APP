import { GenresController } from '../features/genres/genres.controller';

describe('GenresController', () => {
  let controller: GenresController;
  let mockGenresRepo: any;
  let mockCache: any;

  beforeEach(() => {
    mockGenresRepo = {
      all: jest.fn().mockResolvedValue([{ id: 1, name: 'Action' }]),
    };
    mockCache = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn(),
    };
    controller = new GenresController(mockGenresRepo, mockCache);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all genres', async () => {
    const result = await controller.list();
    expect(result).toEqual([{ id: 1, name: 'Action' }]);
    expect(mockGenresRepo.all).toHaveBeenCalled();
    expect(mockCache.set).toHaveBeenCalled();
  });

  it('should return cached genres if present', async () => {
    mockCache.get.mockResolvedValueOnce([{ id: 2, name: 'Comedy' }]);
    const result = await controller.list();
    expect(result).toEqual([{ id: 2, name: 'Comedy' }]);
    expect(mockGenresRepo.all).not.toHaveBeenCalled(); // should not hit DB
  });
});
