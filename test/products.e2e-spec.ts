import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateProductDto } from '../src/products/dto/create-product.dto';
import { UpdateProductDto } from '../src/products/dto/update-product.dto';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let createdProductId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /products', () => {
    const validProduct: CreateProductDto = {
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      stock: 100,
    };

    it('should create a new product', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send(validProduct)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(validProduct.name);
          expect(res.body.price).toBe(validProduct.price);
          createdProductId = res.body.id;
        });
    });

    it('should fail with invalid price (negative)', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({ ...validProduct, price: -10 })
        .expect(400);
    });

    it('should fail with invalid stock (negative)', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({ ...validProduct, stock: -5 })
        .expect(400);
    });

    it('should fail with missing required fields', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({ name: 'Test Product' })
        .expect(400);
    });

    it('should fail with duplicate product name', async () => {
      await request(app.getHttpServer())
        .post('/products')
        .send(validProduct)
        .expect(400);
    });
  });

  describe('GET /products', () => {
    it('should return all products', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should filter products by price range', () => {
      return request(app.getHttpServer())
        .get('/products')
        .query({ minPrice: 50, maxPrice: 150 })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach(product => {
            expect(product.price).toBeGreaterThanOrEqual(50);
            expect(product.price).toBeLessThanOrEqual(150);
          });
        });
    });

    it('should search products by name', () => {
      return request(app.getHttpServer())
        .get('/products')
        .query({ search: 'Test' })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach(product => {
            expect(product.name).toContain('Test');
          });
        });
    });
  });

  describe('GET /products/:id', () => {
    it('should return a specific product', () => {
      return request(app.getHttpServer())
        .get(`/products/${createdProductId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdProductId);
        });
    });

    it('should fail with non-existent product ID', () => {
      return request(app.getHttpServer())
        .get('/products/99999')
        .expect(404);
    });

    it('should fail with invalid product ID format', () => {
      return request(app.getHttpServer())
        .get('/products/invalid-id')
        .expect(400);
    });
  });

  describe('PATCH /products/:id', () => {
    const updateData: UpdateProductDto = {
      price: 149.99,
      stock: 50,
    };

    it('should update a product', () => {
      return request(app.getHttpServer())
        .patch(`/products/${createdProductId}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.price).toBe(updateData.price);
          expect(res.body.stock).toBe(updateData.stock);
        });
    });

    it('should fail updating non-existent product', () => {
      return request(app.getHttpServer())
        .patch('/products/99999')
        .send(updateData)
        .expect(404);
    });

    it('should fail with invalid update data', () => {
      return request(app.getHttpServer())
        .patch(`/products/${createdProductId}`)
        .send({ price: -100 })
        .expect(400);
    });
  });

  describe('GET /products/:id/price-history', () => {
    it('should return price history for a product', () => {
      return request(app.getHttpServer())
        .get(`/products/${createdProductId}/price-history`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('price');
          expect(res.body[0]).toHaveProperty('timestamp');
        });
    });

    it('should fail with non-existent product ID', () => {
      return request(app.getHttpServer())
        .get('/products/99999/price-history')
        .expect(404);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete a product', () => {
      return request(app.getHttpServer())
        .delete(`/products/${createdProductId}`)
        .expect(200);
    });

    it('should fail deleting non-existent product', () => {
      return request(app.getHttpServer())
        .delete('/products/99999')
        .expect(404);
    });

    it('should fail with invalid product ID format', () => {
      return request(app.getHttpServer())
        .delete('/products/invalid-id')
        .expect(400);
    });
  });
}); 