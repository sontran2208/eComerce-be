import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsPositive, Min, IsArray } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Product Title' , description: 'Product Title' })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Product description ' , description: 'Product description' })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @ApiProperty({ example: '100' , description: 'Product price' })
  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number & not more than 2 decimal places' })
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;

  @ApiProperty({ example: '30' , description: 'Product stock' })
  @IsNotEmpty({ message: 'Stock is required' })
  @IsNumber({},{ message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be greater than or equal to 0' })
  stock: number;

  @ApiProperty({ example: 'path/to/image' , description: 'Product image' })
  @IsNotEmpty({ message: 'Images is required' })
  @IsArray({ message: 'Images must be an array' })
  image: string[];

  @ApiProperty({ example: '1' , description: 'category id' })
  @IsNotEmpty({ message: 'Category is required' })
  @IsNumber({},{ message: 'Category must be a number' })
  categoryId: number;
}
