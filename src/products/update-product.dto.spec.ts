import { validate } from 'class-validator';
import { UpdateProductDto } from './update-product.dto';

describe('UpdateProductDto', () => {
  it('should validate a valid DTO with all fields', async () => {
    const dto = new UpdateProductDto();
    dto.name = 'Updated Name';
    dto.price = 20;
    dto.stock = 10;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate a valid DTO with some fields missing', async () => {
    const dto = new UpdateProductDto();
    dto.price = 15;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if price is negative', async () => {
    const dto = new UpdateProductDto();
    dto.price = -1;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'price')).toBe(true);
  });

  it('should fail if stock is negative', async () => {
    const dto = new UpdateProductDto();
    dto.stock = -1;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'stock')).toBe(true);
  });

  it('should fail if name is not a string', async () => {
    const dto = new UpdateProductDto();
    // @ts-expect-error: Intentionally assigning a non-string to test validation
    dto.name = 123;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });
});
