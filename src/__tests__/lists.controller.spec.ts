import { ListsController } from '../features/lists/lists.controller';

describe('ListsController', () => {
  let controller: ListsController;
  let mockListsService: any;

  beforeEach(() => {
    mockListsService = {
      getWatchlist: jest.fn().mockResolvedValue([{ id: 'm1', title: 'Inception' }]),
      addToWatchlist: jest.fn().mockResolvedValue({ id: 'm1', title: 'Inception' }),
      removeFromWatchlist: jest.fn().mockResolvedValue({ success: true }),

      getFavorites: jest.fn().mockResolvedValue([{ id: 'm2', title: 'Interstellar' }]),
      addToFavorites: jest.fn().mockResolvedValue({ id: 'm2', title: 'Interstellar' }),
      removeFromFavorites: jest.fn().mockResolvedValue({ success: true }),
    };

    controller = new ListsController(mockListsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Watchlist', () => {
    it('should return user watchlist', async () => {
      const result = await controller.getWatchlist({ user: { userId: 'u1' } });
      expect(result).toEqual([{ id: 'm1', title: 'Inception' }]);
      expect(mockListsService.getWatchlist).toHaveBeenCalledWith('u1');
    });

    it('should add to watchlist', async () => {
      const result = await controller.addToWatchlist(
        { user: { userId: 'u1' } },
        { movieId: 'm1' },
      );
      expect(result).toEqual({ id: 'm1', title: 'Inception' });
      expect(mockListsService.addToWatchlist).toHaveBeenCalledWith('u1', 'm1');
    });

    it('should remove from watchlist', async () => {
      const result = await controller.removeFromWatchlist(
        { user: { userId: 'u1' } },
        { movieId: 'm1' },
      );
      expect(result).toEqual({ success: true });
      expect(mockListsService.removeFromWatchlist).toHaveBeenCalledWith('u1', 'm1');
    });
  });

  describe('Favorites', () => {
    it('should return user favorites', async () => {
      const result = await controller.getFavorites({ user: { userId: 'u1' } });
      expect(result).toEqual([{ id: 'm2', title: 'Interstellar' }]);
      expect(mockListsService.getFavorites).toHaveBeenCalledWith('u1');
    });

    it('should add to favorites', async () => {
      const result = await controller.addToFavorites(
        { user: { userId: 'u1' } },
        { movieId: 'm2' },
      );
      expect(result).toEqual({ id: 'm2', title: 'Interstellar' });
      expect(mockListsService.addToFavorites).toHaveBeenCalledWith('u1', 'm2');
    });

    it('should remove from favorites', async () => {
      const result = await controller.removeFromFavorites(
        { user: { userId: 'u1' } },
        { movieId: 'm2' },
      );
      expect(result).toEqual({ success: true });
      expect(mockListsService.removeFromFavorites).toHaveBeenCalledWith('u1', 'm2');
    });
  });
});
