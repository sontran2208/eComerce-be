import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class UserSigninDto {
  @ApiProperty({ example: 'tranthanhson@example.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'transon123',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(5, { message: 'Password must be at least 6 characters' })
  password: string;
}
