import configuration from './configuration';

describe('Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return default values when environment variables are not set', () => {
    const config = configuration();
    expect(config).toEqual({
      port: 3000,
      database: {
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '',
        database: 'lisakuv_obchod',
      },
      jwt: {
        secret: 'your-secret-key',
        expiresIn: '1d',
      },
      swagger: {
        title: 'API Documentation',
        description: 'API documentation for the application',
        version: '1.0',
      },
    });
  });

  it('should use environment variables when set', () => {
    process.env.PORT = '4000';
    process.env.DB_HOST = 'test-host';
    process.env.DB_PORT = '5433';
    process.env.DB_USERNAME = 'test-user';
    process.env.DB_PASSWORD = 'test-pass';
    process.env.DB_NAME = 'test-db';
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '2d';

    const config = configuration();
    expect(config).toEqual({
      port: 4000,
      database: {
        host: 'test-host',
        port: 5433,
        username: 'test-user',
        password: 'test-pass',
        database: 'test-db',
      },
      jwt: {
        secret: 'test-secret',
        expiresIn: '2d',
      },
      swagger: {
        title: 'API Documentation',
        description: 'API documentation for the application',
        version: '1.0',
      },
    });
  });

  it('should handle invalid port numbers', () => {
    process.env.PORT = 'invalid';
    process.env.DB_PORT = 'invalid';

    const config = configuration();
    expect(config.port).toBe(3000);
    expect(config.database.port).toBe(5432);
  });
});
