import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { MoreThan } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
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

  update(id: number, update: Partial<Product>) {
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
} 