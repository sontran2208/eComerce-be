import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { OrdersModule } from 'src/orders/orders.module';
import { PaginationService } from 'src/utility/common/pagination/pagination.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PaginationService],
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoriesModule,
    forwardRef(() => OrdersModule),
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
