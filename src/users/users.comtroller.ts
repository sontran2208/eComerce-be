import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserSigninDto } from './dto/user-signin.dto';
import { User } from './entities/user.entity';
import { CurrentUser } from '../utility/decorators/current-user.decorator';
import { AuthenGuard } from '../utility/guards/authen.guard';
import { AuthorGuard } from '../utility/guards/author.guard';
import { Roles } from '../utility/common/user-roles.enum';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists',
  })
  async signup(@Body() userSignupDto: UserSignupDto): Promise<{ user: User }> {
    return { user: await this.usersService.signup(userSignupDto) };
  }

  @Post('signin')
  @ApiOperation({ summary: 'Signin a user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully signed.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'User not found',
  })
  async signin(
    @Body() userSigninDto: UserSigninDto,
  ): Promise<{ user: User; accessToken: string }> {
    const user = await this.usersService.signin(userSigninDto);
    const accessToken = await this.usersService.accessToken(user);
    return { accessToken, user };
  }

  @UseGuards(AuthorGuard([Roles.ADMIN]), AuthenGuard)
  @Get('all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'fetch all users',
    type: [User],
  })
  @ApiResponse({
    status: 401,
    description: 'unauthorized',
  })
  @ApiBearerAuth()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('single/:id')
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({
    status: 200,
    description: 'fetch user',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'user not found',
  })
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(+id);
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  @UseGuards(AuthenGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'fetch current user',
    type: User,
  })
  @ApiResponse({
    status: 403,
    description: 'unauthorized',
  })

  getProfile(@CurrentUser() currentUser: User) {
    return currentUser;
  }
}
