import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    currentUser: User,
  ): Promise<Category> {
    const category = await this.categoryRepository.create(createCategoryDto);
    category.addedBy = currentUser;
    return this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
      relations: {
        addedBy: true,
      },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
    if (!category) throw new Error('Category not found');
    return category;
  }

  async update(id: number, fields: Partial<UpdateCategoryDto>) {
    const category = await this.findOne(id);
    if (!category) throw new Error('Category not found');
    Object.assign(category, fields);
    await this.categoryRepository.save(category);
    return category;
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (!category) throw new Error('Category not found');
    await this.categoryRepository.remove(category);
    return `This action removes a #${id} category`;
  }
}
