import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { MoreThan } from 'typeorm';
import { PriceHistory } from './price-history.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(PriceHistory)
    private priceHistoryRepository: Repository<PriceHistory>,
  ) {}

  create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  findAll(minPrice?: number, maxPrice?: number, search?: string): Promise<Product[]> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    if (search) {
      queryBuilder.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    }
    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
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
