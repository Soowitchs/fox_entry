import { Test, TestingModule } from '@nestjs/testing';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { bootstrap } from './main';
import { UsersService } from './modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './modules/auth/auth.service';

jest.mock('helmet', () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn()),
}));
jest.mock('compression', () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn()),
}));
jest.mock('express-rate-limit', () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn()),
}));

beforeAll(() => {
  jest.spyOn(DocumentBuilder.prototype, 'setTitle').mockImplementation(function () { return this; });
  jest.spyOn(DocumentBuilder.prototype, 'setDescription').mockImplementation(function () { return this; });
  jest.spyOn(DocumentBuilder.prototype, 'setVersion').mockImplementation(function () { return this; });
  jest.spyOn(DocumentBuilder.prototype, 'addBearerAuth').mockImplementation(function () { return this; });
  jest.spyOn(DocumentBuilder.prototype, 'build').mockImplementation(function () {
    return {
      openapi: '3.0.0',
      info: { title: '', version: '' },
      paths: {},
      components: {},
      servers: [],
      tags: [],
    };
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Bootstrap', () => {
  let mockApp: any;
  let originalExit: any;
  let consoleSpy: jest.SpyInstance;
  let exitSpy: jest.SpyInstance;
  let nestFactoryCreateSpy: jest.SpyInstance;

  beforeEach(() => {
    mockApp = {
      useGlobalPipes: jest.fn(),
      useGlobalFilters: jest.fn(),
      use: jest.fn(),
      enableCors: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };

    nestFactoryCreateSpy = jest.spyOn(NestFactory, 'create').mockResolvedValue(mockApp);
    (DocumentBuilder.prototype.setTitle as jest.Mock).mockReturnThis();
    (DocumentBuilder.prototype.setDescription as jest.Mock).mockReturnThis();
    (DocumentBuilder.prototype.setVersion as jest.Mock).mockReturnThis();
    (DocumentBuilder.prototype.addBearerAuth as jest.Mock).mockReturnThis();
    (DocumentBuilder.prototype.build as jest.Mock).mockReturnValue({});
    (SwaggerModule.createDocument as jest.Mock).mockReturnValue({});
    (SwaggerModule.setup as jest.Mock).mockReturnValue(undefined);

    originalExit = process.exit;
    process.exit = jest.fn() as any;

    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    exitSpy = jest.spyOn(process, 'exit').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.exit = originalExit;
    if (consoleSpy) consoleSpy.mockRestore();
    if (exitSpy) exitSpy.mockRestore();
    if (nestFactoryCreateSpy) nestFactoryCreateSpy.mockRestore();
  });

  it('should bootstrap the application successfully', async () => {
    const originalEnv = process.env;
    process.env = { ...originalEnv, PORT: '3000' };

    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(
      AppModule,
      expect.any(Object),
    );
    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      expect.any(ValidationPipe),
    );
    expect(mockApp.useGlobalFilters).toHaveBeenCalledWith(
      expect.any(HttpExceptionFilter),
    );
    expect(mockApp.use).toHaveBeenCalledWith(expect.any(Function)); // helmet
    expect(mockApp.use).toHaveBeenCalledWith(expect.any(Function)); // compression
    expect(mockApp.enableCors).toHaveBeenCalled();
    expect(mockApp.use).toHaveBeenCalledWith(expect.any(Function)); // rateLimit
    expect(mockApp.listen).toHaveBeenCalledWith(3000);

    process.env = originalEnv;
  });

  it('should handle bootstrap errors', async () => {
    const mockError = new Error('Test error');
    (NestFactory.create as jest.Mock).mockRejectedValue(mockError);

    await bootstrap();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to start application: Test error',
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn().mockReturnValue('Hello World!'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'PORT':
                  return 3000;
                default:
                  return undefined;
              }
            }),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
