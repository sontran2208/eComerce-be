import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { User } from 'src/users/entities/user.entity';
import { Shipping } from './shipping.entity';
import { OrdersProducts } from './orders-products.entity';
@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: string;

  @Column({ nullable: true })
  shippedAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  @ManyToOne(() => User, (user) => user.ordersUpdateBy)
  updateBy: User;

  @OneToOne(() => Shipping, (shipping) => shipping.order, { cascade: true })
  @JoinColumn()
  shippingAddress: Shipping;

  @OneToMany(() => OrdersProducts, (op) => op.order, { cascade: true })
  products: OrdersProducts[];

  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}
