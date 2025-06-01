import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token', () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
      };
      const mockToken = { access_token: 'test-token' };

      mockAuthService.login.mockReturnValue(mockToken);

      const result = controller.login({ user: mockUser });

      expect(result).toEqual(mockToken);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });
  });
});
