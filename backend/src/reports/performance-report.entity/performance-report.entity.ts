import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/user.entity/user.entity';

@Entity('performance_reports')
export class PerformanceReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  reportDate: Date;

  @Column()
  totalOrders: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalSales: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  averageOrderValue: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  averagePreparationTime: number;

  @Column({ type: 'json' })
  orderStatusBreakdown: any;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
