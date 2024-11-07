import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShippingDto {
  @ApiProperty({
    description: 'The phone number of the recipient',
    example: '123-456-7890',
  })
  @IsNotEmpty({ message: 'phone is required' })
  @IsString({ message: 'phone must be a string' })
  phone: string;

  @ApiProperty({
    description: 'The name of the recipient (optional)',
    example: 'Trần Thanh Sơn',
    required: false, // Chỉ định rằng trường này là tùy chọn
  })
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name: string;

  @ApiProperty({
    description: 'The address of the recipient',
    example: '123 Main St',
  })
  @IsNotEmpty({ message: 'address is required' })
  @IsString({ message: 'address must be a string' })
  address: string;

  @ApiProperty({
    description: 'The city of the recipient',
    example: 'Hanoi',
  })
  @IsNotEmpty({ message: 'city is required' })
  @IsString({ message: 'city must be a string' })
  city: string;

  @ApiProperty({
    description: 'The postcode of the recipient',
    example: '100000',
  })
  @IsNotEmpty({ message: 'postcode is required' })
  @IsString({ message: 'postcode must be a string' })
  postcode: string;

  @ApiProperty({
    description: 'The state of the recipient',
    example: 'Hanoi',
  })
  @IsNotEmpty({ message: 'state is required' })
  @IsString({ message: 'state must be a string' })
  state: string;

  @ApiProperty({
    description: 'The country of the recipient',
    example: 'VietNam',
  })
  @IsNotEmpty({ message: 'country is required' })
  @IsString({ message: 'country must be a string' })
  country: string;
}
