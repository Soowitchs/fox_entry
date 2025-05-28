import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProduct = { id: 1, name: 'Test', price: 10, stock: 5, description: 'desc' };
  const mockService = {
    create: jest.fn().mockResolvedValue(mockProduct),
    findAll: jest.fn().mockResolvedValue([mockProduct]),
    findOne: jest.fn().mockResolvedValue(mockProduct),
    update: jest.fn().mockResolvedValue(mockProduct),
    remove: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue([mockProduct]),
    filterByStock: jest.fn().mockResolvedValue([mockProduct]),
    getPriceHistory: jest.fn().mockResolvedValue([{ price: 10, timestamp: new Date() }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockService },
      ],
    }).compile();
    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', async () => {
    const dto: CreateProductDto = { name: 'Test', price: 10, stock: 5, description: 'desc' };
    expect(await controller.create(dto)).toEqual(mockProduct);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should get all products', async () => {
    expect(await controller.findAll()).toEqual([mockProduct]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should get a product by id', async () => {
    expect(await controller.findOne('1')).toEqual(mockProduct);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a product', async () => {
    const dto: UpdateProductDto = { price: 20 };
    expect(await controller.update('1', dto)).toEqual(mockProduct);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a product', async () => {
    expect(await controller.remove('1')).toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('should find by name', async () => {
    expect(await controller.findByName('Test')).toEqual([mockProduct]);
    expect(service.findByName).toHaveBeenCalledWith('Test');
  });

  it('should filter by stock', async () => {
    expect(await controller.filterByStock(1)).toEqual([mockProduct]);
    expect(service.filterByStock).toHaveBeenCalledWith(1);
  });

  it('should get price history', async () => {
    expect(await controller.getPriceHistory(1)).toEqual([{ price: 10, timestamp: expect.any(Date) }]);
    expect(service.getPriceHistory).toHaveBeenCalledWith(1);
  });

  it('should handle not found error', async () => {
    mockService.findOne.mockRejectedValueOnce(new NotFoundException());
    await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
  });
}); 