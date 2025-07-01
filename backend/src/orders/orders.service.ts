import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity/order.entity';
import { OrderItem } from './order-item.entity/order-item.entity';
import { User } from '../users/user.entity/user.entity';
import { Table } from '../tables/table.entity/table.entity';
import { MenuItem } from '../menu/menu-item.entity/menu-item.entity';

export class CreateOrderDto {
  tableId: number;
  waiterId: number;
  notes?: string;
  orderItems: CreateOrderItemDto[];
}

export class CreateOrderItemDto {
  menuItemId: number;
  quantity: number;
  specialInstructions?: string;
}

export class UpdateOrderDto {
  status?: OrderStatus;
  notes?: string;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['waiter', 'table', 'orderItems', 'orderItems.menuItem'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['waiter', 'table', 'orderItems', 'orderItems.menuItem'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findByTable(tableId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { table: { id: tableId } },
      relations: ['waiter', 'table', 'orderItems', 'orderItems.menuItem'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderRepository.find({
      where: { status },
      relations: ['waiter', 'table', 'orderItems', 'orderItems.menuItem'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const waiter = await this.userRepository.findOne({
      where: { id: createOrderDto.waiterId },
    });
    if (!waiter) {
      throw new NotFoundException(`Waiter with ID ${createOrderDto.waiterId} not found`);
    }

    const table = await this.tableRepository.findOne({
      where: { id: createOrderDto.tableId },
    });
    if (!table) {
      throw new NotFoundException(`Table with ID ${createOrderDto.tableId} not found`);
    }

    const order = this.orderRepository.create({
      waiter,
      table,
      notes: createOrderDto.notes,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    for (const itemDto of createOrderDto.orderItems) {
      const menuItem = await this.menuItemRepository.findOne({
        where: { id: itemDto.menuItemId },
      });
      if (!menuItem) {
        throw new NotFoundException(`Menu item with ID ${itemDto.menuItemId} not found`);
      }

      const orderItem = this.orderItemRepository.create({
        order: savedOrder,
        menuItem,
        quantity: itemDto.quantity,
        unitPrice: menuItem.price,
        totalPrice: menuItem.price * itemDto.quantity,
        specialInstructions: itemDto.specialInstructions,
      });

      const savedOrderItem = await this.orderItemRepository.save(orderItem);
      orderItems.push(savedOrderItem);
      totalAmount += savedOrderItem.totalPrice;
    }

    // Update order total amount
    savedOrder.totalAmount = totalAmount;
    savedOrder.orderItems = orderItems;
    return this.orderRepository.save(savedOrder);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }

  async calculateTotal(id: number): Promise<number> {
    const order = await this.findOne(id);
    return order.totalAmount;
  }
}
