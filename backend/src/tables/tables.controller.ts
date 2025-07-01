import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TablesService, CreateTableDto, UpdateTableDto } from './tables.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserRole } from '../users/user.entity/user.entity';
import { TableStatus } from './table.entity/table.entity';

@Controller('tables')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.tablesService.findByStatus(TableStatus.AVAILABLE);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(+id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesService.update(+id, updateTableDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.tablesService.remove(+id);
  }

  @Post(':id/open')
  @Roles(UserRole.WAITER, UserRole.ADMIN)
  openTable(@Param('id') id: string) {
    return this.tablesService.openTable(+id);
  }

  @Post(':id/close')
  @Roles(UserRole.WAITER, UserRole.ADMIN)
  closeTable(@Param('id') id: string) {
    return this.tablesService.closeTable(+id);
  }

  @Post(':id/reserve')
  @Roles(UserRole.WAITER, UserRole.ADMIN)
  reserveTable(@Param('id') id: string) {
    return this.tablesService.reserveTable(+id);
  }
}
