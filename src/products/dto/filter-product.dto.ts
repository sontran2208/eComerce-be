import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FilterProductDto {
  @ApiProperty({
    description: 'Search term to filter products by title',
    required: false,
    example: 'Bánh mặn',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Category ID to filter products by category',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  category?: number;

  @ApiProperty({
    description: 'Minimum price to filter products',
    required: false,
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  minPrice?: number;

  @ApiProperty({
    description: 'Maximum price to filter products',
    required: false,
    example: 1000,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  maxPrice?: number;

  @ApiProperty({
    description: 'Minimum rating to filter products',
    required: false,
    example: 4,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  minRating?: number;

  @ApiProperty({
    description: 'Maximum rating to filter products',
    required: false,
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  maxRating?: number;
}
