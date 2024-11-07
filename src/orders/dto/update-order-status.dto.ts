import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../enums/order-status.enum';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'The status of the order',
    example: OrderStatus.SHIPPED,
    enum: OrderStatus, // Chỉ định rằng đây là một enum
  })
  @IsNotEmpty()
  @IsString()
  @IsIn([OrderStatus.SHIPPED, OrderStatus.DELIVERED], {
    message: 'status must be either SHIPPED or DELIVERED',
  })
  status: OrderStatus;
}
