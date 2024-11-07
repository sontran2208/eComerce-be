import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProducts } from './entities/orders-products.entity';
import { Shipping } from './entities/shipping.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrdersProducts)
    private readonly ordersProductsRepository: Repository<OrdersProducts>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}
  async create(
    createOrderDto: CreateOrderDto,
    currentUser: User,
  ): Promise<Order> {
    const shippingEntity = new Shipping();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    const orderEntity = new Order();
    orderEntity.shippingAddress = shippingEntity;
    orderEntity.user = currentUser;

    const orderTbl = await this.orderRepository.save(orderEntity);

    let opEntity: {
      order: Order;
      product: Product;
      product_unit_price: number;
      product_quantity: number;
    }[] = [];

    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      const order = orderTbl;
      const product = await this.productsService.findOne(
        createOrderDto.orderedProducts[i].id,
      );
      const product_quantity =
        createOrderDto.orderedProducts[i].product_quantity;
      const product_unit_price =
        createOrderDto.orderedProducts[i].product_unit_price;
      opEntity.push({
        order,
        product,
        product_unit_price,
        product_quantity,
      });
    }
    const op = await this.ordersProductsRepository
      .createQueryBuilder()
      .insert()
      .into(OrdersProducts)
      .values(opEntity)
      .execute();
    return await this.findOne(orderTbl.id);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: {
        shippingAddress: true,
        user: true,
        products: { product: true },
      },
    });
  }

  async findOne(id: number): Promise<Order> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: {
        shippingAddress: true,
        user: true,
        products: { product: true },
      },
    });
  }

  async findOneByProductId(id: number) {
    return await this.ordersProductsRepository.findOne({
      relations: { product: true },
      where: { product: { id: id } },
    });
  }

  async update(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    currentUser: User,
  ) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order not found');

    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(`Order is already ${order.status}`);
    }
    if (
      order.status === OrderStatus.PROCESSING &&
      updateOrderStatusDto.status != OrderStatus.SHIPPED
    ) {
      throw new BadRequestException(`delivery before shipped !!!`);
    }
    if (
      updateOrderStatusDto.status === OrderStatus.SHIPPED &&
      order.status === OrderStatus.SHIPPED
    ) {
      return order;
    }
    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }
    order.status = updateOrderStatusDto.status;
    order.updateBy = currentUser;
    order = await this.orderRepository.save(order);

    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      await this.stockUpdate(order, OrderStatus.DELIVERED);
    }
    return order;
  }

  async cancelled(id: number, currentUser: User) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status === OrderStatus.CANCELLED) {
      return order;
    }
    order.status = OrderStatus.CANCELLED;
    order.updateBy = currentUser;
    order = await this.orderRepository.save(order);
    await this.stockUpdate(order, OrderStatus.CANCELLED);
    return order;
  }

  async remove(id: number): Promise<{ message: string }> {
    const order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order not found');
    await this.orderRepository.remove(order);
    return { message: 'Order deleted successfully' };
  }

  async stockUpdate(order: Order, status: OrderStatus) {
    for (const op of order.products) {
      await this.productsService.updateStock(
        op.product.id,
        op.product_quantity,
        status,
      );
    }
  }
}
