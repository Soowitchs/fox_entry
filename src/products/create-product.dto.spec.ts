import { validate } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

describe('CreateProductDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = new CreateProductDto();
    dto.name = 'Product Name';
    dto.price = 10;
    dto.stock = 5;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is empty', async () => {
    const dto = new CreateProductDto();
    dto.name = '';
    dto.price = 10;
    dto.stock = 5;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('should fail if price is negative', async () => {
    const dto = new CreateProductDto();
    dto.name = 'Product Name';
    dto.price = -1;
    dto.stock = 5;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'price')).toBe(true);
  });

  it('should fail if stock is negative', async () => {
    const dto = new CreateProductDto();
    dto.name = 'Product Name';
    dto.price = 10;
    dto.stock = -1;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'stock')).toBe(true);
  });

  it('should fail if required fields are missing', async () => {
    const dto = new CreateProductDto();
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'name')).toBe(true);
    expect(errors.some((e) => e.property === 'price')).toBe(true);
    expect(errors.some((e) => e.property === 'stock')).toBe(true);
  });
});
