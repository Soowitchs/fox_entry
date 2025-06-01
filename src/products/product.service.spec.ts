import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { PriceHistory } from './price-history.entity';
import { Repository } from 'typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<Product>;
  let priceHistoryRepository: Repository<PriceHistory>;

  const mockProductRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockPriceHistoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(PriceHistory),
          useValue: mockPriceHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    priceHistoryRepository = module.get<Repository<PriceHistory>>(
      getRepositoryToken(PriceHistory),
    );

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 10, stock: 5 },
        { id: 2, name: 'Product 2', price: 20, stock: 10 },
      ];
      mockProductRepository.find.mockResolvedValue(mockProducts);

      const result = await service.findAll();
      expect(result).toEqual(mockProducts);
      expect(mockProductRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const mockProduct = { id: 1, name: 'Product 1', price: 10, stock: 5 };
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.findOne(1);
      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null when product is not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new product and price history', async () => {
      const createProductDto = { name: 'New Product', price: 15, stock: 10 };
      const mockProduct = { id: 1, ...createProductDto };
      const mockPriceHistory = {
        id: 1,
        productId: 1,
        price: 15,
        timestamp: expect.any(Date),
      };

      mockProductRepository.create.mockReturnValue(mockProduct);
      mockProductRepository.save.mockResolvedValue(mockProduct);
      mockPriceHistoryRepository.create.mockReturnValue(mockPriceHistory);
      mockPriceHistoryRepository.save.mockResolvedValue(mockPriceHistory);

      const result = await service.create(createProductDto);
      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.create).toHaveBeenCalledWith(
        createProductDto,
      );
      expect(mockProductRepository.save).toHaveBeenCalledWith(mockProduct);
      expect(mockPriceHistoryRepository.create).toHaveBeenCalled();
      expect(mockPriceHistoryRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a product and create price history if price changed', async () => {
      const updateProductDto = { price: 20 };
      const existingProduct = { id: 1, name: 'Product 1', price: 15, stock: 5 };
      const updatedProduct = { ...existingProduct, price: 20 };
      const mockPriceHistory = {
        id: 1,
        productId: 1,
        price: 20,
        timestamp: expect.any(Date),
      };

      mockProductRepository.findOne.mockResolvedValue(existingProduct);
      mockProductRepository.update.mockResolvedValue({ affected: 1 });
      mockPriceHistoryRepository.create.mockReturnValue(mockPriceHistory);
      mockPriceHistoryRepository.save.mockResolvedValue(mockPriceHistory);

      const result = await service.update(1, updateProductDto);
      expect(result).toEqual({ affected: 1 });
      expect(mockProductRepository.update).toHaveBeenCalledWith(
        1,
        updateProductDto,
      );
      expect(mockPriceHistoryRepository.create).toHaveBeenCalled();
      expect(mockPriceHistoryRepository.save).toHaveBeenCalled();
    });

    it('should not create price history if price is not changed', async () => {
      const updateProductDto = { name: 'Updated Name' };
      const existingProduct = { id: 1, name: 'Product 1', price: 15, stock: 5 };

      mockProductRepository.findOne.mockResolvedValue(existingProduct);
      mockProductRepository.update.mockResolvedValue({ affected: 1 });
      mockPriceHistoryRepository.create.mockReturnValue(null);
      mockPriceHistoryRepository.save.mockResolvedValue(null);

      const result = await service.update(1, updateProductDto);
      expect(result).toEqual({ affected: 1 });
      expect(mockProductRepository.update).toHaveBeenCalledWith(
        1,
        updateProductDto,
      );
      expect(mockPriceHistoryRepository.create).not.toHaveBeenCalled();
      expect(mockPriceHistoryRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
