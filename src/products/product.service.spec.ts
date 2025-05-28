import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { PriceHistory } from './price-history.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let productRepo: jest.Mocked<Repository<Product>>;
  let priceHistoryRepo: jest.Mocked<Repository<PriceHistory>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => queryBuilderMock),
          },
        },
        {
          provide: getRepositoryToken(PriceHistory),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepo = module.get(getRepositoryToken(Product));
    priceHistoryRepo = module.get(getRepositoryToken(PriceHistory));
  });

  const queryBuilderMock: any = {
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a product', async () => {
      const dto: CreateProductDto = { name: 'A', description: 'B', price: 1, stock: 2 };
      const product = { ...dto, id: 1 } as Product;
      productRepo.create.mockReturnValue(product);
      productRepo.save.mockResolvedValue(product);
      const result = await service.create(dto);
      expect(productRepo.create).toHaveBeenCalledWith(dto);
      expect(productRepo.save).toHaveBeenCalledWith(product);
      expect(result).toBe(product);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      queryBuilderMock.getMany.mockResolvedValue([{}]);
      productRepo.createQueryBuilder.mockReturnValue(queryBuilderMock);
      const result = await service.findAll();
      expect(result).toEqual([{}]);
    });
    it('should filter by minPrice, maxPrice, and search', async () => {
      queryBuilderMock.getMany.mockResolvedValue([{}]);
      productRepo.createQueryBuilder.mockReturnValue(queryBuilderMock);
      await service.findAll(10, 100, 'test');
      expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(3);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const product = { id: 1 } as Product;
      productRepo.findOneBy.mockResolvedValue(product);
      const result = await service.findOne(1);
      expect(result).toBe(product);
    });
    it('should throw NotFoundException if not found', async () => {
      productRepo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the product', async () => {
      const product = { id: 1 } as Product;
      productRepo.update.mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(service, 'findOne').mockResolvedValue(product);
      const dto: UpdateProductDto = { price: 10 };
      const result = await service.update(1, dto);
      expect(productRepo.update).toHaveBeenCalledWith(1, dto);
      expect(result).toBe(product);
    });
  });

  describe('remove', () => {
    it('should delete the product', async () => {
      productRepo.delete.mockResolvedValue({ affected: 1 } as any);
      await service.remove(1);
      expect(productRepo.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('findByName', () => {
    it('should find products by name', async () => {
      const products = [{ id: 1, name: 'A' } as Product];
      productRepo.find.mockResolvedValue(products);
      const result = await service.findByName('A');
      expect(productRepo.find).toHaveBeenCalledWith({ where: { name: 'A' } });
      expect(result).toBe(products);
    });
  });

  describe('filterByStock', () => {
    it('should filter products by stock', async () => {
      const products = [{ id: 1, stock: 10 } as Product];
      productRepo.find.mockResolvedValue(products);
      const result = await service.filterByStock(5);
      expect(productRepo.find).toHaveBeenCalledWith({ where: { stock: expect.any(Object) } });
      expect(result).toBe(products);
    });
  });

  describe('getPriceHistory', () => {
    it('should return price history for a product', async () => {
      const history = [{ id: 1 } as PriceHistory];
      priceHistoryRepo.find.mockResolvedValue(history);
      const result = await service.getPriceHistory(1);
      expect(priceHistoryRepo.find).toHaveBeenCalledWith({
        where: { product: { id: 1 } },
        order: { changedAt: 'DESC' },
      });
      expect(result).toBe(history);
    });
  });
}); 