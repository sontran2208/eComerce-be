import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthenGuard } from 'src/utility/guards/authen.guard';
import { AuthorGuard } from 'src/utility/guards/author.guard';
import { Roles } from 'src/utility/common/user-roles.enum';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Product } from './entities/product.entity';
import { SerializeIncludes } from 'src/utility/interceptors/serialize.interceptor';
import { ProductsDto } from './dto/products.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { PaginationResultDto } from 'src/utility/pagination/pagination-result.dto';
import { PaginationDto } from 'src/utility/pagination/pagination.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { PaginationResult } from 'src/utility/common/pagination/pagination.interface';
@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthenGuard, AuthorGuard([Roles.ADMIN]))
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created.',
    type: Product,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: User,
  ): Promise<Product> {
    return await this.productsService.create(createProductDto, currentUser);
  }

  @Get('with-filters')
  @ApiOperation({ summary: 'Get products with query' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit the number of products returned',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset the start of the product list returned',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all products.',
    type: [ProductsDto],
  })
  @SerializeIncludes(ProductsDto)
  async findAllWithFilters(
    @Query() filterDto: FilterProductDto,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginationResult<Product>> {
    return this.productsService.findAllWithFilters(filterDto, paginationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Return all products.',
    type: [ProductsDto],
  })
  async findAll(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @Get('with-pagination')
  @ApiOperation({ summary: 'Get all products with pagination' })
  async findProductWithPagination(@Query() paginationDto: PaginationDto) {
    return await this.productsService.findAllWithPagination(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the product to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Return the product by ID.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productsService.findOne(+id);
  }

  @UseGuards(AuthenGuard, AuthorGuard([Roles.ADMIN]))
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'The ID of the product to update' })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() currentUser: User,
  ): Promise<Product> {
    return await this.productsService.update(
      +id,
      updateProductDto,
      currentUser,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'The ID of the product to delete' })
  @ApiResponse({ status: 204, description: 'Product successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(+id);
  }
}
