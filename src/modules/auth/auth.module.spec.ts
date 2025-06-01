import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.registerAsync({
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('jwt.secret') || 'test-secret',
            signOptions: { expiresIn: configService.get('jwt.expiresIn') || '1h' },
          }),
          inject: [ConfigService],
        }),
        AuthModule,
      ],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue({
              id: 1,
              email: 'test@example.com',
              password: 'hashed-password',
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'jwt.secret':
                  return 'test-secret';
                case 'jwt.expiresIn':
                  return '1h';
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should import JwtModule', () => {
    const jwtModule = module.select(JwtModule);
    expect(jwtModule).toBeDefined();
  });

  it('should import PassportModule', () => {
    const passportModule = module.select(PassportModule);
    expect(passportModule).toBeDefined();
  });

  it('should import UsersModule', () => {
    const usersModule = module.select(UsersModule);
    expect(usersModule).toBeDefined();
  });

  it('should provide AuthService', () => {
    const authService = module.get(AuthService);
    expect(authService).toBeDefined();
  });

  it('should provide LocalStrategy', () => {
    const localStrategy = module.get(LocalStrategy);
    expect(localStrategy).toBeDefined();
  });

  it('should provide JwtStrategy', () => {
    const jwtStrategy = module.get(JwtStrategy);
    expect(jwtStrategy).toBeDefined();
  });
});
