import { ListsService } from '../features/lists/lists.service';

describe('ListsService', () => {
  let service: ListsService;
  let mockPrismaService: any;

  beforeEach(() => {
    mockPrismaService = {
      watchlist: {
        findMany: jest.fn().mockResolvedValue([{ id: 'm1', movie: { title: 'Inception' } }]),
        create: jest.fn().mockResolvedValue({ id: 'm1', movieId: 'm1' }),
        delete: jest.fn().mockResolvedValue({ success: true })
      },
      favorite: {
        findMany: jest.fn().mockResolvedValue([{ id: 'm2', movie: { title: 'Interstellar' } }]),
        create: jest.fn().mockResolvedValue({ id: 'm2', movieId: 'm2' }),
        delete: jest.fn().mockResolvedValue({ success: true })
      }
    };
    service = new ListsService(mockPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get user watchlist', async () => {
    const result = await service.getWatchlist('u1');
    expect(result).toEqual([{ id: 'm1', movie: { title: 'Inception' } }]);
    expect(mockPrismaService.watchlist.findMany).toHaveBeenCalledWith({ where: { userId: 'u1' }, include: { movie: true } });
  });

  it('should add to watchlist', async () => {
    const result = await service.addToWatchlist('u1', 'm1');
    expect(result).toEqual({ id: 'm1', movieId: 'm1' });
    expect(mockPrismaService.watchlist.create).toHaveBeenCalledWith({ data: { userId: 'u1', movieId: 'm1' } });
  });

  it('should remove from watchlist', async () => {
    const result = await service.removeFromWatchlist('u1', 'm1');
    expect(result).toEqual({ success: true });
    expect(mockPrismaService.watchlist.delete).toHaveBeenCalledWith({ where: { userId_movieId: { userId: 'u1', movieId: 'm1' } } });
  });

  it('should get user favorites', async () => {
    const result = await service.getFavorites('u1');
    expect(result).toEqual([{ id: 'm2', movie: { title: 'Interstellar' } }]);
    expect(mockPrismaService.favorite.findMany).toHaveBeenCalledWith({ where: { userId: 'u1' }, include: { movie: true } });
  });

  it('should add to favorites', async () => {
    const result = await service.addToFavorites('u1', 'm2');
    expect(result).toEqual({ id: 'm2', movieId: 'm2' });
    expect(mockPrismaService.favorite.create).toHaveBeenCalledWith({ data: { userId: 'u1', movieId: 'm2' } });
  });

  it('should remove from favorites', async () => {
    const result = await service.removeFromFavorites('u1', 'm2');
    expect(result).toEqual({ success: true });
    expect(mockPrismaService.favorite.delete).toHaveBeenCalledWith({ where: { userId_movieId: { userId: 'u1', movieId: 'm2' } } });
  });
});
