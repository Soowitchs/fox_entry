import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Products API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  it('/products (POST, GET, DELETE)', async () => {
    // Create
    const createRes = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Test Product', price: 10, stock: 5 })
      .expect(201);
    expect(createRes.body).toHaveProperty('id');
    const id = createRes.body.id;

    // Get
    const getRes = await request(app.getHttpServer())
      .get(`/products/${id}`)
      .expect(200);
    expect(getRes.body.name).toBe('Test Product');

    // Delete
    await request(app.getHttpServer())
      .delete(`/products/${id}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
}); 