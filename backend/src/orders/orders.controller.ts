import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService, CreateOrderDto, UpdateOrderDto } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserRole } from '../users/user.entity/user.entity';
import { OrderStatus } from './order.entity/order.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: OrderStatus) {
    return this.ordersService.findByStatus(status);
  }

  @Get('table/:tableId')
  findByTable(@Param('tableId') tableId: string) {
    return this.ordersService.findByTable(+tableId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Get(':id/total')
  calculateTotal(@Param('id') id: string) {
    return this.ordersService.calculateTotal(+id);
  }

  @Post()
  @Roles(UserRole.WAITER, UserRole.ADMIN)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Patch(':id')
  @Roles(UserRole.WAITER, UserRole.CHEF, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Patch(':id/status/:status')
  @Roles(UserRole.WAITER, UserRole.CHEF, UserRole.ADMIN)
  updateStatus(@Param('id') id: string, @Param('status') status: OrderStatus) {
    return this.ordersService.updateStatus(+id, status);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
