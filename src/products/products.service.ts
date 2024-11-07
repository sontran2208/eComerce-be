import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { User } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import dataSource from 'db/data-source';
import { OrdersService } from 'src/orders/orders.service';
import { PaginationDto } from 'src/utility/pagination/pagination.dto';
import { PaginationResultDto } from 'src/utility/pagination/pagination-result.dto';
import { FilterProductDto } from './dto/filter-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoriesService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    currentUser: User,
  ): Promise<Product> {
    const category = await this.categoryService.findOne(
      +createProductDto.categoryId,
    );
    const product = this.productRepository.create(createProductDto);
    product.category = category;
    product.addedBy = currentUser;
    return await this.productRepository.save(product);
  }

  async findAllWithFiltersAndPagination(
    filterDto: FilterProductDto,
    paginationDto: PaginationDto,
  ): Promise<PaginationResultDto<Product>> {
    const { page, limit } = paginationDto;
    const { search, category, minPrice, maxPrice, minRating, maxRating } = filterDto;

    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoin('product.reviews', 'review')
      .addSelect([
        'COUNT(review.id) AS reviewCount',
        'AVG(review.rating)::numeric(10,2) AS avgRating',
      ])
      .groupBy('product.id, category.id')
      .skip((page - 1) * limit)
      .take(limit);

    // Áp dụng các bộ lọc tương tự như ví dụ trước đây
    if (search) {
      queryBuilder.andWhere('product.title LIKE :title', { title: `%${search}%` });
    }

    if (category) {
      queryBuilder.andWhere('category.id = :id', { id: category });
    }

    if (minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (minRating) {
      queryBuilder.andHaving('AVG(review.rating) >= :minRating', { minRating });
    }

    if (maxRating) {
      queryBuilder.andHaving('AVG(review.rating) <= :maxRating', { maxRating });
    }

    const [products, total] = await queryBuilder.getManyAndCount();

    return new PaginationResultDto(products, total, page, limit);
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: {
        addedBy: true,
        category: true,
      },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
        category: {
          id: true,
          title: true,
        },
      },
    });
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: Partial<UpdateProductDto>,
    currentUser: User,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    product.addedBy = currentUser;
    if (updateProductDto.categoryId) {
      const category = await this.categoryService.findOne(
        +updateProductDto.categoryId,
      );
      product.category = category;
    }
    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    const order = await this.ordersService.findOneByProductId(product.id);
    if (order) throw new BadRequestException(`Product is already ordered !!!`);
    return await this.productRepository.remove(product);
  }

  async updateStock(id: number, stock: number, status: string) {
    let product = await this.findOne(id);
    if (status === OrderStatus.DELIVERED) {
      product.stock = product.stock + stock;
    } else {
      product.stock += stock;
    }
    product = await this.productRepository.save(product);
    return product;
  }
}
