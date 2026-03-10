import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and return access token', async () => {
      authService.register.mockResolvedValue({ access_token: 'jwt_token' });

      const result = await controller.register({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({ access_token: 'jwt_token' });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.register).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
    });
  });

  describe('login', () => {
    it('should call authService.login and return access token', async () => {
      authService.login.mockResolvedValue({ access_token: 'jwt_token' });

      const result = await controller.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({ access_token: 'jwt_token' });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.login).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
    });
  });
});
