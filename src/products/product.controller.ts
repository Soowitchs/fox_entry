import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() product: CreateProductDto) {
    return this.productService.create(product);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('search')
  findByName(@Query('name') name: string) {
    return this.productService.findByName(name);
  }

  @Get('filter')
  filterByStock(@Query('minStock') minStock: number) {
    return this.productService.filterByStock(Number(minStock));
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() update: UpdateProductDto) {
    return this.productService.update(Number(id), update);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productService.remove(Number(id));
  }

  @Get(':id/price-history')
  getPriceHistory(@Param('id') id: number) {
    return this.productService.getPriceHistory(Number(id));
  }
}
