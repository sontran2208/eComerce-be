import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderedProductsDto {
  @ApiProperty({
    description: 'The unique identifier of the product',
    example: 1,
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'The unit price of the product, with a maximum of 2 decimal places',
    example: 690000,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'price must be a number & maximum 2 decimal places' },
  )
  @IsPositive({ message: 'price must be a positive number' })
  product_unit_price: number;

  @ApiProperty({
    description: 'The quantity of the product ordered, with a maximum of 2 decimal places',
    example: 2,
  })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Quantity must be a number' })
  @IsPositive({ message: 'Quantity must be a positive number' })
  product_quantity: number;
}
