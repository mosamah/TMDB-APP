import { MoviePrismaRepository } from '../infra/repos/movie.prisma.repo';

describe('MoviePrismaRepository', () => {
  let repo: MoviePrismaRepository;

  beforeEach(() => {
    const mockPrismaService = { /* mock methods as needed */ } as any;
    repo = new MoviePrismaRepository(mockPrismaService);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  // Add more tests for each method in MoviePrismaRepository
});
