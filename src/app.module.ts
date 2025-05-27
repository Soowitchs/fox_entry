import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'lisakuv_obchod',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
