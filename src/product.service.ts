import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { MoreThan } from 'typeorm';
import { PriceHistory } from './price-history.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(PriceHistory)
    private priceHistoryRepository: Repository<PriceHistory>,
  ) {}

  create(product: Partial<Product>) {
    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: number) {
    return this.productRepository.findOneBy({ id });
  }

  async update(id: number, update: Partial<Product>) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) return null;
    if (update.price !== undefined && update.price !== product.price) {
      await this.priceHistoryRepository.save({
        product,
        oldPrice: product.price,
        newPrice: update.price,
      });
    }
    return this.productRepository.update(id, update);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }

  findByName(name: string) {
    return this.productRepository.find({ where: { name } });
  }

  filterByStock(minStock: number) {
    return this.productRepository.find({ where: { stock: MoreThan(minStock) } });
  }

  async getPriceHistory(productId: number) {
    return this.priceHistoryRepository.find({
      where: { product: { id: productId } },
      order: { changedAt: 'DESC' },
    });
  }
} 