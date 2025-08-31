import axios from 'axios';
import { TmdbService } from '../features/tmdb/tmdb.service';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TmdbService', () => {
  let service: TmdbService;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockInstance = {
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
      defaults: { baseURL: 'https://api.themoviedb.org/3' },
    } as any;

    mockedAxios.create.mockReturnValue(mockInstance);

    service = new TmdbService();
  });

  it('should get genres from TMDB', async () => {
    (service as any).client.get.mockResolvedValue({
      data: { genres: [{ id: 1, name: 'Action' }] },
    });

    const result = await service.getGenres();

    expect(result).toEqual([{ id: 1, name: 'Action' }]);
    expect((service as any).client.get).toHaveBeenCalledWith('/genre/movie/list');
  });

  it('should get popular movies from TMDB', async () => {
    (service as any).client.get.mockResolvedValue({
      data: { results: [{ id: 101, title: 'Movie1' }] },
    });

    const result = await service.getPopular(1);

    expect(result).toEqual({ results: [{ id: 101, title: 'Movie1' }] });
    expect((service as any).client.get).toHaveBeenCalledWith('/movie/popular', { params: { page: 1 } });
  });

  it('should get movie details from TMDB', async () => {
    (service as any).client.get.mockResolvedValue({
      data: { id: 101, title: 'Movie1', overview: 'A movie' },
    });

    const result = await service.getMovieDetails(101);

    expect(result).toEqual({ id: 101, title: 'Movie1', overview: 'A movie' });
    expect((service as any).client.get).toHaveBeenCalledWith('/movie/101');
  });
});
