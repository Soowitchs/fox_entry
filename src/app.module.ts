import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Product } from './products/product.entity';
import { ProductService } from './products/product.service';
import { ProductController } from './products/product.controller';
import { PriceHistory } from './products/price-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Product, PriceHistory],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Product, PriceHistory]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class AppModule {}
