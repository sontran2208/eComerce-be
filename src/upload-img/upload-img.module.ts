import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadImgService } from './upload-img.service';
import { UploadImgController } from './upload-img.controller';
import { UploadImg } from './entities/upload-img.entity';
import { ProductsModule } from 'src/products/products.module';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UploadImg, Product])],
  controllers: [UploadImgController],
  providers: [UploadImgService],
  exports: [UploadImgService],
})
export class UploadImgModule {}
