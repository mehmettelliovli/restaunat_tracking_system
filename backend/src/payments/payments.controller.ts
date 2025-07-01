import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PaymentsService, CreatePaymentDto, UpdatePaymentDto } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserRole } from '../users/user.entity/user.entity';
import { PaymentStatus } from './payment.entity/payment.entity';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.CASHIER)
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get('status/:status')
  @Roles(UserRole.ADMIN, UserRole.CASHIER)
  findByStatus(@Param('status') status: PaymentStatus) {
    return this.paymentsService.findByStatus(status);
  }

  @Get('order/:orderId')
  @Roles(UserRole.ADMIN, UserRole.CASHIER)
  findByOrder(@Param('orderId') orderId: string) {
    return this.paymentsService.findByOrder(+orderId);
  }

  @Get('table/:tableId/bill')
  @Roles(UserRole.ADMIN, UserRole.CASHIER, UserRole.WAITER)
  getTableBill(@Param('tableId') tableId: string) {
    return this.paymentsService.getTableBill(+tableId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CASHIER)
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CASHIER)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CASHIER)
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Post(':id/process')
  @Roles(UserRole.ADMIN, UserRole.CASHIER)
  processPayment(@Param('id') id: string) {
    return this.paymentsService.processPayment(+id);
  }

  @Post(':id/refund')
  @Roles(UserRole.ADMIN, UserRole.CASHIER)
  refundPayment(@Param('id') id: string) {
    return this.paymentsService.refundPayment(+id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
