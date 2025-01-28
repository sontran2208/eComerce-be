import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadImg } from './entities/upload-img.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class UploadImgService {
  constructor(
    @InjectRepository(UploadImg)
    private readonly uploadRepository: Repository<UploadImg>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async saveFile(
    file: Express.Multer.File,
    productId: number,
  ): Promise<UploadImg> {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    const upload = this.uploadRepository.create({
      filename: file.originalname,
      filepath: file.path,
      mimetype: file.mimetype,
      product: { id: productId },
    });

    return this.uploadRepository.save(upload);
  }

  async findAll(): Promise<UploadImg[]> {
    return this.uploadRepository.find();
  }

  async findOne(id: number): Promise<UploadImg> {
    return this.uploadRepository.findOneBy({ id });
  }
}
