import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InventoryService, CreateInventoryItemDto, UpdateInventoryItemDto } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserRole } from '../users/user.entity/user.entity';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.CHEF)
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('low-stock')
  @Roles(UserRole.ADMIN, UserRole.CHEF)
  findLowStock() {
    return this.inventoryService.findLowStock();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CHEF)
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(+id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createInventoryItemDto: CreateInventoryItemDto) {
    return this.inventoryService.create(createInventoryItemDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateInventoryItemDto: UpdateInventoryItemDto) {
    return this.inventoryService.update(+id, updateInventoryItemDto);
  }

  @Patch(':id/stock/:quantity')
  @Roles(UserRole.ADMIN, UserRole.CHEF)
  updateStock(@Param('id') id: string, @Param('quantity') quantity: string) {
    return this.inventoryService.updateStock(+id, +quantity);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(+id);
  }
}
