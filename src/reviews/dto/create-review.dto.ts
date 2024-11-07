import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'The ID of the product being reviewed',
    example: 3,
  })
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsNumber({}, { message: 'Product ID must be a number' })
  productId: number;

  @ApiProperty({
    description: 'The rating given to the product',
    example: 5,
  })
  @IsNotEmpty({ message: 'Rating is required' })
  @IsNumber({}, { message: 'Rating must be a number' })
  rating: number;

  @ApiProperty({
    description: 'The comment provided by the reviewer',
    example: 'Great product, really satisfied!',
  })
  @IsNotEmpty({ message: 'Comment is required' })
  @IsString({ message: 'Comment must be a string' })
  comment: string;
}
