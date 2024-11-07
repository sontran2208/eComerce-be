import { IsNotEmpty, IsString } from 'class-validator';
import { UserSigninDto } from './user-signin.dto';
import { ApiProperty } from '@nestjs/swagger';
export class UserSignupDto extends UserSigninDto {
  @ApiProperty({ description: 'The name of the user', example: 'Tran Thanh Son' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;
}
