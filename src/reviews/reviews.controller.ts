import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Review } from './entities/review.entity';
import { Roles } from 'src/utility/common/user-roles.enum';
import { AuthorGuard } from 'src/utility/guards/author.guard';
import { AuthenGuard } from 'src/utility/guards/authen.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiProperty,
  ApiQuery,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/utility/pagination/pagination.dto';
import { PaginationResultDto } from 'src/utility/pagination/pagination-result.dto';

@Controller('reviews')
@ApiTags('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @UseGuards(AuthenGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({
    status: 201,
    description: 'Review successfully created.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() currentUser: User,
  ): Promise<Review> {
    return await this.reviewsService.create(createReviewDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews for a specific product' })
  @ApiQuery({ name: 'productId', required: true })
  @ApiResponse({
    status: 200,
    description: 'List of reviews for the specified product',
  })
  @ApiResponse({ status: 400, description: 'Bad Request: Invalid product ID' })
  @ApiResponse({ status: 404, description: 'Not Found: Product not found' })
  async findAllByProduct(
    @Query('productId') productId: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginationResultDto<Review>> {
    return await this.reviewsService.findAllByProduct(
      +productId,
      paginationDto,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the review to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Return the review by ID.',
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  async findOne(@Param('id') id: string): Promise<Review> {
    return await this.reviewsService.findOne(+id);
  }
  @UseGuards(AuthenGuard, AuthorGuard([Roles.ADMIN]))
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the review to update' })
  @ApiResponse({
    status: 200,
    description: 'Review successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Unauthorized.' })
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return await this.reviewsService.update(+id, updateReviewDto);
  }
  @UseGuards(AuthorGuard([Roles.ADMIN]), AuthenGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the review to delete' })
  @ApiResponse({ status: 204, description: 'Review successfully deleted.' })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized. You need to be authenticated to delete a review.',
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.reviewsService.remove(+id);
  }
}
