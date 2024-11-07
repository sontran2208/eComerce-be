import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthenGuard } from 'src/utility/guards/authen.guard';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthorGuard } from 'src/utility/guards/author.guard';
import { Roles } from 'src/utility/common/user-roles.enum';
import { Category } from './entities/category.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthenGuard, AuthorGuard([Roles.ADMIN]))
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: 201, type: Category })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() currentUser: User,
  ): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, type: [Category] })
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: 200, type: Category })
  @ApiResponse({ status: 403, description: 'Category not found' })
  async findOne(@Param('id') id: string): Promise<Category> {
    return await this.categoriesService.findOne(+id);
  }

  @UseGuards(AuthenGuard, AuthorGuard([Roles.ADMIN]))
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 200, type: Category })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.update(+id, updateCategoryDto);
  }

  @UseGuards(AuthenGuard, AuthorGuard([Roles.ADMIN]))
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'category not found' })
  async remove(@Param('id') id: string) {
    return await this.categoriesService.remove(+id);
  }
}
