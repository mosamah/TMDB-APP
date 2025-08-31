import { GenrePrismaRepository } from '../infra/repos/genre.prisma.repo';

describe('GenrePrismaRepository', () => {
  let repo: GenrePrismaRepository;

  beforeEach(() => {
    const mockPrismaService = { /* mock methods as needed */ } as any;
    repo = new GenrePrismaRepository(mockPrismaService);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  // Add more tests for each method in GenrePrismaRepository
});
