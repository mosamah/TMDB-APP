import { AuthService } from '../features/auth/auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockPrismaService: any;
  let mockJwtService: any;

  beforeEach(() => {
    mockPrismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue({ id: 'u1', email: 'test@example.com', passwordHash: 'hash' }),
        create: jest.fn().mockResolvedValue({ id: 'u1', email: 'test@example.com', passwordHash: 'hash' })
      }
    };
    mockJwtService = {
      sign: jest.fn().mockReturnValue('token')
    };
    service = new AuthService(mockPrismaService, mockJwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user with correct password', async () => {
    // Mock bcrypt.compare to always return true
    jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true);
    const result = await service.validateUser('test@example.com', 'pass');
    expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(result).toEqual({ id: 'u1', email: 'test@example.com' });
  });

  it('should return null for invalid user', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);
    const result = await service.validateUser('wrong@example.com', 'pass');
    expect(result).toBeNull();
  });

  it('should login user and return token', async () => {
    const result = await service.login({ id: 'u1', email: 'test@example.com' });
    expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: 'u1', email: 'test@example.com' });
    expect(result).toEqual({ accessToken: 'token' });
  });

  it('should register user and return token', async () => {
    // Mock bcrypt.hash to return a fixed hash
    jest.spyOn(require('bcrypt'), 'hash').mockResolvedValue('hash');
    const result = await service.register('test@example.com', 'pass');
    expect(mockPrismaService.user.create).toHaveBeenCalledWith({ data: { email: 'test@example.com', passwordHash: 'hash' } });
    expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: 'u1', email: 'test@example.com' });
    expect(result).toEqual({ accessToken: 'token' });
  });
});
