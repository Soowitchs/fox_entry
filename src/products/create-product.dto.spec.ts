import { validate } from 'class-validator';
import { CreateProductDto } from './dto/create-product.dto';

describe('CreateProductDto', () => {
  it('should validate a valid dto', async () => {
    const dto = new CreateProductDto();
    dto.name = 'Test';
    dto.description = 'desc';
    dto.price = 10;
    dto.stock = 5;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should require name', async () => {
    const dto = new CreateProductDto();
    dto.description = 'desc';
    dto.price = 10;
    dto.stock = 5;
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'name')).toBe(true);
  });

  it('should require price >= 0', async () => {
    const dto = new CreateProductDto();
    dto.name = 'Test';
    dto.description = 'desc';
    dto.price = -1;
    dto.stock = 5;
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'price')).toBe(true);
  });

  it('should require stock >= 0', async () => {
    const dto = new CreateProductDto();
    dto.name = 'Test';
    dto.description = 'desc';
    dto.price = 10;
    dto.stock = -1;
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'stock')).toBe(true);
  });
}); 