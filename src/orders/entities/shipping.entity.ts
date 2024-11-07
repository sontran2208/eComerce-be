import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'shippings' })
export class Shipping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column({ default: '' })
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postcode: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @OneToOne(() => Order, (order) => order.shippingAddress)
  order: Order;
}
