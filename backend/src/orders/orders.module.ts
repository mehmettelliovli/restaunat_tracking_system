import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity/order.entity';
import { OrderItem } from './order-item.entity/order-item.entity';
import { User } from '../users/user.entity/user.entity';
import { Table } from '../tables/table.entity/table.entity';
import { MenuItem } from '../menu/menu-item.entity/menu-item.entity';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [TypeOrmModule.forFeature([Order, OrderItem, User, Table, MenuItem])],
  exports: [OrdersService]
})
export class OrdersModule {}
