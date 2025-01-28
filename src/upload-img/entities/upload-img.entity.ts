import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('uploads-img')
export class UploadImg {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  filename: string;

  @Column({ length: 255 })
  filepath: string;

  @Column({ length: 100 })
  mimetype: string;

  @CreateDateColumn()
  uploadedAt: Date;

  @Column({ nullable: true })
  productId: number;

  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: Product;
}
