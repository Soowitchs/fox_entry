import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query('minPrice') minPrice?: number, @Query('maxPrice') maxPrice?: number, @Query('search') search?: string) {
    return this.productService.findAll(minPrice, maxPrice, search);
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
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @Get(':id/price-history')
  getPriceHistory(@Param('id') id: number) {
    return this.productService.getPriceHistory(Number(id));
  }
}
