import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sales_reports')
export class SalesReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  reportDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalSales: number;

  @Column()
  totalOrders: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  averageOrderValue: number;

  @Column({ type: 'json' })
  salesByCategory: any;

  @Column({ type: 'json' })
  salesByPaymentMethod: any;

  @Column({ type: 'json' })
  topSellingItems: any;

  @CreateDateColumn()
  createdAt: Date;
}
