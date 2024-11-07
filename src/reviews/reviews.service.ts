import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/users/entities/user.entity';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { PaginationDto } from 'src/utility/pagination/pagination.dto';
import { PaginationResultDto } from 'src/utility/pagination/pagination-result.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly productsService: ProductsService,
  ) {}
  async create(
    createReviewDto: CreateReviewDto,
    currentUser: User,
  ): Promise<Review> {
    const product = await this.productsService.findOne(
      createReviewDto.productId,
    );
    let review = await this.findOneByUserAndProduct(
      currentUser.id,
      createReviewDto.productId,
    );
    if (!review) {
      review = this.reviewsRepository.create(createReviewDto);
      review.user = currentUser;
      review.product = product;
    } else {
      review.comment = createReviewDto.comment;
      review.rating = createReviewDto.rating;
    }
    return await this.reviewsRepository.save(review);
  }

  async findAllByProduct(
    id: number,
    paginationDto: PaginationDto,
  ): Promise<PaginationResultDto<Review>> {
    const product = await this.productsService.findOne(id);
    if (!product) throw new Error('Product not found');

    const { page, limit } = paginationDto;

    const [result, total] = await this.reviewsRepository.findAndCount({
      where: {
        product: {
          id,
        },
      },
      relations: {
        user: true, 
        product: {
          category: true, 
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return new PaginationResultDto(result, total, page, limit);

  }
  async findOne(id: number): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.findOne(id);
    Object.assign(review, updateReviewDto);
    return await this.reviewsRepository.save(review);
  }

  async remove(id: number): Promise<{ message: string }> {
    const review = await this.findOne(id);
    await this.reviewsRepository.remove(review);
    return { message: 'Review deleted' };
  }

  async findOneByUserAndProduct(userId: number, productId: number) {
    return await this.reviewsRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        product: {
          id: productId,
        },
      },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
  }
}
