import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentMethod, PaymentStatus } from './payment.entity/payment.entity';
import { Order } from '../orders/order.entity/order.entity';
import { User } from '../users/user.entity/user.entity';

export class CreatePaymentDto {
  orderId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  processedBy: number;
  transactionId?: string;
  notes?: string;
}

export class UpdatePaymentDto {
  status?: PaymentStatus;
  notes?: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({
      relations: ['order', 'processedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['order', 'processedBy'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async findByOrder(orderId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { order: { id: orderId } },
      relations: ['order', 'processedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: PaymentStatus): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { status },
      relations: ['order', 'processedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const order = await this.orderRepository.findOne({
      where: { id: createPaymentDto.orderId },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${createPaymentDto.orderId} not found`);
    }

    const processedBy = await this.userRepository.findOne({
      where: { id: createPaymentDto.processedBy },
    });
    if (!processedBy) {
      throw new NotFoundException(`User with ID ${createPaymentDto.processedBy} not found`);
    }

    const payment = this.paymentRepository.create({
      order,
      processedBy,
      amount: createPaymentDto.amount,
      paymentMethod: createPaymentDto.paymentMethod,
      status: PaymentStatus.PENDING,
      transactionId: createPaymentDto.transactionId,
      notes: createPaymentDto.notes,
    });

    return this.paymentRepository.save(payment);
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);
    Object.assign(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }

  async processPayment(id: number): Promise<Payment> {
    const payment = await this.findOne(id);
    payment.status = PaymentStatus.COMPLETED;
    return this.paymentRepository.save(payment);
  }

  async refundPayment(id: number): Promise<Payment> {
    const payment = await this.findOne(id);
    payment.status = PaymentStatus.REFUNDED;
    return this.paymentRepository.save(payment);
  }

  async remove(id: number): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepository.remove(payment);
  }

  async getTableBill(tableId: number): Promise<any> {
    const orders = await this.orderRepository.find({
      where: { table: { id: tableId } },
      relations: ['orderItems', 'orderItems.menuItem'],
    });

    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const payments = await this.paymentRepository.find({
      where: { order: { table: { id: tableId } } },
    });

    const paidAmount = payments
      .filter(payment => payment.status === PaymentStatus.COMPLETED)
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      tableId,
      totalAmount,
      paidAmount,
      remainingAmount: totalAmount - paidAmount,
      orders,
      payments,
    };
  }
}
