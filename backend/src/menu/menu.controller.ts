import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MenuService, CreateMenuItemDto, UpdateMenuItemDto, CreateCategoryDto, UpdateCategoryDto } from './menu.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserRole } from '../users/user.entity/user.entity';

@Controller('menu')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // MenuItem endpoints
  @Get('items')
  findAllMenuItems() {
    return this.menuService.findAllMenuItems();
  }

  @Get('items/:id')
  findMenuItemById(@Param('id') id: string) {
    return this.menuService.findMenuItemById(+id);
  }

  @Get('items/category/:categoryId')
  findMenuItemsByCategory(@Param('categoryId') categoryId: string) {
    return this.menuService.findMenuItemsByCategory(+categoryId);
  }

  @Post('items')
  @Roles(UserRole.ADMIN)
  createMenuItem(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuService.createMenuItem(createMenuItemDto);
  }

  @Patch('items/:id')
  @Roles(UserRole.ADMIN)
  updateMenuItem(@Param('id') id: string, @Body() updateMenuItemDto: UpdateMenuItemDto) {
    return this.menuService.updateMenuItem(+id, updateMenuItemDto);
  }

  @Delete('items/:id')
  @Roles(UserRole.ADMIN)
  removeMenuItem(@Param('id') id: string) {
    return this.menuService.removeMenuItem(+id);
  }

  // Category endpoints
  @Get('categories')
  findAllCategories() {
    return this.menuService.findAllCategories();
  }

  @Get('categories/:id')
  findCategoryById(@Param('id') id: string) {
    return this.menuService.findCategoryById(+id);
  }

  @Post('categories')
  @Roles(UserRole.ADMIN)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.menuService.createCategory(createCategoryDto);
  }

  @Patch('categories/:id')
  @Roles(UserRole.ADMIN)
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.menuService.updateCategory(+id, updateCategoryDto);
  }

  @Delete('categories/:id')
  @Roles(UserRole.ADMIN)
  removeCategory(@Param('id') id: string) {
    return this.menuService.removeCategory(+id);
  }
}
