import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByName: jest.fn(),
    filterByStock: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getPriceHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
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
    const dto: CreateProductDto = { name: 'Test', price: 10, stock: 5 };
    const result = { id: 1, ...dto };
    mockProductService.create.mockResolvedValue(result);
    expect(await controller.create(dto)).toEqual(result);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all products', async () => {
    const result = [{ id: 1, name: 'A', price: 1, stock: 1 }];
    mockProductService.findAll.mockResolvedValue(result);
    expect(await controller.findAll()).toEqual(result);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should search products by name', async () => {
    const result = [{ id: 1, name: 'A', price: 1, stock: 1 }];
    mockProductService.findByName.mockResolvedValue(result);
    expect(await controller.findByName('A')).toEqual(result);
    expect(service.findByName).toHaveBeenCalledWith('A');
  });

  it('should filter products by stock', async () => {
    const result = [{ id: 1, name: 'A', price: 1, stock: 10 }];
    mockProductService.filterByStock.mockResolvedValue(result);
    expect(await controller.filterByStock(5)).toEqual(result);
    expect(service.filterByStock).toHaveBeenCalledWith(5);
  });

  it('should return a product by id', async () => {
    const result = { id: 1, name: 'A', price: 1, stock: 1 };
    mockProductService.findOne.mockResolvedValue(result);
    expect(await controller.findOne(1)).toEqual(result);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a product', async () => {
    const dto: UpdateProductDto = { price: 20 };
    const result = { affected: 1 };
    mockProductService.update.mockResolvedValue(result);
    expect(await controller.update(1, dto)).toEqual(result);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a product', async () => {
    const result = { affected: 1 };
    mockProductService.remove.mockResolvedValue(result);
    expect(await controller.remove(1)).toEqual(result);
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('should get price history for a product', async () => {
    const result = [{ id: 1, oldPrice: 10, newPrice: 20, changedAt: new Date() }];
    mockProductService.getPriceHistory.mockResolvedValue(result);
    expect(await controller.getPriceHistory(1)).toEqual(result);
    expect(service.getPriceHistory).toHaveBeenCalledWith(1);
  });
}); 