import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './products/products.module';
import { SharedModule } from './shared/shared.module';
import { PrometheusService } from './shared/monitoring/prometheus.service';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useFactory: async () => ({
            type: 'sqlite',
            database: ':memory:',
            entities: [],
            synchronize: true,
          }),
        }),
        AuthModule,
        UsersModule,
        ProductsModule,
        SharedModule,
      ],
    })
      .overrideProvider(PrometheusService)
      .useValue({
        incrementHttpRequests: jest.fn(),
        observeHttpRequestDuration: jest.fn(),
      })
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should import ConfigModule', () => {
    const configModule = module.select(ConfigModule);
    expect(configModule).toBeDefined();
  });

  it('should import TypeOrmModule', () => {
    const typeOrmModule = module.select(TypeOrmModule);
    expect(typeOrmModule).toBeDefined();
  });

  it('should import AuthModule', () => {
    const authModule = module.select(AuthModule);
    expect(authModule).toBeDefined();
  });

  it('should import UsersModule', () => {
    const usersModule = module.select(UsersModule);
    expect(usersModule).toBeDefined();
  });

  it('should import ProductsModule', () => {
    const productsModule = module.select(ProductsModule);
    expect(productsModule).toBeDefined();
  });

  it('should import SharedModule', () => {
    const sharedModule = module.select(SharedModule);
    expect(sharedModule).toBeDefined();
  });
});
