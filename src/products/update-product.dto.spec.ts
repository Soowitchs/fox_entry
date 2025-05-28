import { validate } from 'class-validator';
import { UpdateProductDto } from './dto/update-product.dto';

describe('UpdateProductDto', () => {
  it('should validate a valid dto', async () => {
    const dto = new UpdateProductDto();
    dto.name = 'Test';
    dto.description = 'desc';
    dto.price = 10;
    dto.stock = 5;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should allow empty dto', async () => {
    const dto = new UpdateProductDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should require price >= 0 if set', async () => {
    const dto = new UpdateProductDto();
    dto.price = -1;
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'price')).toBe(true);
  });

  it('should require stock >= 0 if set', async () => {
    const dto = new UpdateProductDto();
    dto.stock = -1;
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'stock')).toBe(true);
  });
}); 