import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { PriceHistory } from './price-history.entity';
import { Repository } from 'typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let productRepo: Repository<Product>;
  let priceHistoryRepo: Repository<PriceHistory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PriceHistory),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepo = module.get<Repository<Product>>(getRepositoryToken(Product));
    priceHistoryRepo = module.get<Repository<PriceHistory>>(getRepositoryToken(PriceHistory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
}); 