import { AuthController } from '../features/auth/auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: any;

  beforeEach(() => {
    mockAuthService = {
      register: jest.fn().mockResolvedValue({ accessToken: 'token' }),
      validateUser: jest.fn().mockResolvedValue({ id: 'u1', email: 'test@example.com' }),
      login: jest.fn().mockResolvedValue({ accessToken: 'token' })
    };
    controller = new AuthController(mockAuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const result = await controller.register({ email: 'test@example.com', password: 'pass' });
    expect(result).toEqual({ accessToken: 'token' });
    expect(mockAuthService.register).toHaveBeenCalledWith('test@example.com', 'pass');
  });

  it('should login a user', async () => {
    mockAuthService.validateUser.mockResolvedValue({ id: 'u1', email: 'test@example.com' });
    const result = await controller.login({ email: 'test@example.com', password: 'pass' });
    expect(result).toEqual({ accessToken: 'token' });
    expect(mockAuthService.validateUser).toHaveBeenCalledWith('test@example.com', 'pass');
    expect(mockAuthService.login).toHaveBeenCalledWith({ id: 'u1', email: 'test@example.com' });
  });
});
