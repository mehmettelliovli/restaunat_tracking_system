import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity/payment.entity';
import { Order } from '../orders/order.entity/order.entity';
import { User } from '../users/user.entity/user.entity';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [TypeOrmModule.forFeature([Payment, Order, User])],
  exports: [PaymentsService]
})
export class PaymentsModule {}
