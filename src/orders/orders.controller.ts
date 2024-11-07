import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Order } from './entities/order.entity';
import { AuthorGuard } from 'src/utility/guards/author.guard';
import { AuthenGuard } from 'src/utility/guards/authen.guard';
import { Roles } from 'src/utility/common/user-roles.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthenGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order successfully created.', type: Order })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() currentUser: User,
  ): Promise<Order> {
    return this.ordersService.create(createOrderDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Return all orders.'})
  async findAll(): Promise<Order[]> {
    return await this.ordersService.findAll();
  }

  @UseGuards(AuthenGuard, AuthorGuard([Roles.ADMIN]))
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the order to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the order by ID.'})
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findOne(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.findOne(+id);
  }

  @UseGuards(AuthenGuard, AuthorGuard([Roles.ADMIN]))
  @Put(':id')
  @ApiOperation({ summary: 'Update an order status' })
  @ApiParam({ name: 'id', description: 'The ID of the order to update' })
  @ApiResponse({ status: 200, description: 'Order status successfully updated.', type: Order })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @CurrentUser() currentUser: User,
  ) {
    return await this.ordersService.update(
      +id,
      updateOrderStatusDto,
      currentUser,
    );
  }

  @UseGuards(AuthenGuard, AuthorGuard([Roles.ADMIN]))
  @Put('cancel/:id')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'id', description: 'The ID of the order to cancel' })
  @ApiResponse({ status: 200, description: 'Order successfully cancelled.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async cancelled(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return await this.ordersService.cancelled(+id, currentUser);
  }
  @UseGuards(AuthenGuard, AuthorGuard([Roles.ADMIN]))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'id', description: 'The ID of the order to delete' })
  @ApiResponse({ status: 204, description: 'Order successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return await this.ordersService.remove(+id);
  }
}
