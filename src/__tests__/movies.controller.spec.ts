import { MoviesController } from '../features/movies/movies.controller';

describe('MoviesController', () => {
  let controller: MoviesController;
  let mockMoviesService: any;

  beforeEach(() => {
    mockMoviesService = {
      list: jest.fn().mockResolvedValue([{ id: 'm1', title: 'Inception' }]),
      detail: jest.fn().mockResolvedValue({ id: 'm1', title: 'Inception' })
    };
    controller = new MoviesController(mockMoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should list movies', async () => {
    const query = { page: 1, limit: 10, sort: 'title', order: 'asc' };
    const result = await controller.list(query);
    expect(result).toEqual([{ id: 'm1', title: 'Inception' }]);
    expect(mockMoviesService.list).toHaveBeenCalledWith(query);
  });

  it('should get movie detail', async () => {
    const result = await controller.detail('m1');
    expect(result).toEqual({ id: 'm1', title: 'Inception' });
    expect(mockMoviesService.detail).toHaveBeenCalledWith('m1');
  });
});
