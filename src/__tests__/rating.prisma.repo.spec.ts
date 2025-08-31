import { RatingPrismaRepository } from '../infra/repos/rating.prisma.repo';

describe('RatingPrismaRepository', () => {
  let repo: RatingPrismaRepository;

  beforeEach(() => {
    const mockPrismaService = { /* mock methods as needed */ } as any;
    repo = new RatingPrismaRepository(mockPrismaService);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  // Add more tests for each method in RatingPrismaRepository
});
