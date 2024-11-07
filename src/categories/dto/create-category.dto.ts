import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'title of category' })
  @IsNotEmpty({ message: 'title is required' })
  @IsString({ message: 'title must be a string' })
  title: string;
  @ApiProperty({
    example: 'Electronics description ...',
    description: 'description of category',
  })
  @IsNotEmpty({ message: 'description is required' })
  @IsString({ message: 'description must be a string' })
  description: string;
}
