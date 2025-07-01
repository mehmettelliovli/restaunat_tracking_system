import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './menu-item.entity/menu-item.entity';
import { Category } from './category.entity/category.entity';

export class CreateMenuItemDto {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl?: string;
  variations?: any;
}

export class UpdateMenuItemDto {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  isAvailable?: boolean;
  imageUrl?: string;
  variations?: any;
}

export class CreateCategoryDto {
  name: string;
  description?: string;
  imageUrl?: string;
}

export class UpdateCategoryDto {
  name?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // MenuItem methods
  async findAllMenuItems(): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      relations: ['category'],
      where: { isAvailable: true },
      order: { name: 'ASC' },
    });
  }

  async findMenuItemById(id: number): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
    return menuItem;
  }

  async findMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      where: { category: { id: categoryId }, isAvailable: true },
      relations: ['category'],
    });
  }

  async createMenuItem(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    const category = await this.categoryRepository.findOne({
      where: { id: createMenuItemDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${createMenuItemDto.categoryId} not found`);
    }

    const menuItem = this.menuItemRepository.create({
      ...createMenuItemDto,
      category,
    });
    return this.menuItemRepository.save(menuItem);
  }

  async updateMenuItem(id: number, updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItem> {
    const menuItem = await this.findMenuItemById(id);
    
    if (updateMenuItemDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateMenuItemDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${updateMenuItemDto.categoryId} not found`);
      }
      menuItem.category = category;
    }

    Object.assign(menuItem, updateMenuItemDto);
    return this.menuItemRepository.save(menuItem);
  }

  async removeMenuItem(id: number): Promise<void> {
    const menuItem = await this.findMenuItemById(id);
    await this.menuItemRepository.remove(menuItem);
  }

  // Category methods
  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['menuItems'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findCategoryById(id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async removeCategory(id: number): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.categoryRepository.remove(category);
  }
}
