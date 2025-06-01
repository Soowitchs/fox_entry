import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { MoreThan } from 'typeorm';
import { PriceHistory } from './price-history.entity';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(PriceHistory)
    private priceHistoryRepository: Repository<PriceHistory>,
  ) {}

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: number) {
    return this.productRepository.findOne({ where: { id } });
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);

    // Create price history entry
    const priceHistory = this.priceHistoryRepository.create({
      product: savedProduct,
      oldPrice: 0,
      newPrice: savedProduct.price,
    });
    await this.priceHistoryRepository.save(priceHistory);

    return savedProduct;
  }

  async update(id: number, update: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) return null;

    if (update.price !== undefined && update.price !== product.price) {
      const priceHistory = this.priceHistoryRepository.create({
        product,
        oldPrice: product.price,
        newPrice: update.price,
      });
      await this.priceHistoryRepository.save(priceHistory);
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
    return this.productRepository.find({
      where: { stock: MoreThan(minStock) },
    });
  }

  async getPriceHistory(productId: number) {
    return this.priceHistoryRepository.find({
      where: { product: { id: productId } },
      order: { changedAt: 'DESC' },
    });
  }
}
