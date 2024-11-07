import { PartialType } from '@nestjs/mapped-types';
import { UserSigninDto } from './user-signin.dto';

export class UpdateUserDto extends PartialType(UserSigninDto) {}
