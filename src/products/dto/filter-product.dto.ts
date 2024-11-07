import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FilterProductDto {
  @ApiProperty({
    description: 'Search term to filter products by title',
    required: false,
    example: 'Laptop'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Category ID to filter products by category',
    required: false,
    example: 1
  })
  @IsOptional()
  @IsNumber()
  category?: number;

  @ApiProperty({
    description: 'Minimum price to filter products',
    required: false,
    example: 100
  })
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiProperty({
    description: 'Maximum price to filter products',
    required: false,
    example: 1000
  })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @ApiProperty({
    description: 'Minimum rating to filter products',
    required: false,
    example: 4
  })
  @IsOptional()
  @IsNumber()
  minRating?: number;

  @ApiProperty({
    description: 'Maximum rating to filter products',
    required: false,
    example: 5
  })
  @IsOptional()
  @IsNumber()
  maxRating?: number;
}
