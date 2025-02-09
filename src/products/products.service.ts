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
import { PaginationResult } from 'src/utility/common/pagination/pagination.interface';
import { PaginationService } from 'src/utility/common/pagination/pagination.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoriesService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    private readonly paginationService: PaginationService,
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

  async findAllWithFilters(
    filterDto: FilterProductDto,
    paginationDto: PaginationDto,
  ): Promise<PaginationResult<Product>> {
    const { search, category, minPrice, maxPrice, minRating, maxRating } =
      filterDto;
    const { page, limit } = paginationDto;

    // Base Query không có GROUP BY
    const baseQuery = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'uploads-img')
      .leftJoin('product.reviews', 'review');

    // Áp dụng các bộ lọc
    if (search) {
      baseQuery.andWhere(
        'LOWER(unaccent(product.title)) ILIKE LOWER(unaccent(:title))',
        {
          title: `%${search}%`,
        },
      );
    }

    if (category) {
      baseQuery.andWhere('category.id = :id', { id: category });
    }

    if (minPrice) {
      baseQuery.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      baseQuery.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // Lấy tổng số sản phẩm (không áp dụng phân trang)
    const total = await baseQuery.getCount();

    // Áp dụng pagination
    const data = await baseQuery
      .take(limit)
      .skip((page - 1) * limit)
      .getMany();

    // Nếu có filter rating, cần tính trung bình thủ công
    let ratingsQuery = this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.reviews', 'review')
      .select([
        'product.id AS productId',
        'COUNT(review.id) AS reviewCount',
        'AVG(review.rating)::numeric(10,2) AS avgRating',
      ])
      .groupBy('product.id');

    const ratingsData = await ratingsQuery.getRawMany();

    // Gán rating vào data
    const finalData = data.map((product) => {
      const ratingInfo = ratingsData.find((r) => r.productId === product.id);
      return {
        ...product,
        reviewCount: ratingInfo ? Number(ratingInfo.reviewCount) : 0,
        avgRating: ratingInfo ? Number(ratingInfo.avgRating) : null,
      };
    });

    return {
      data: finalData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll() {
    return await this.productRepository.find({
      relations: {
        addedBy: true,
        category: true,
        images: true,
      },
    });
  }

  async findAllWithPagination(
    paginationDto: PaginationDto,
  ): Promise<PaginationResult<Product>> {
    const { page, limit } = paginationDto;
    const [data, total] = await this.productRepository.findAndCount({
      relations: {
        addedBy: true,
        category: true,
        images: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return this.paginationService.getPaginationMeta(data, total, page, limit);
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: {
        addedBy: true,
        category: true,
        images: true,
        reviews: true,
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
    const averageRating = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.reviews', 'review')
      .where('product.id = :id', { id })
      .select('AVG(review.rating)', 'averageRating')
      .getRawOne();

    return {
      ...product,
      averageRating: parseFloat(averageRating?.averageRating) || 0,
    };
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
