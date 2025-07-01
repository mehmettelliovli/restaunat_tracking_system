import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesReport } from './sales-report.entity/sales-report.entity';
import { PerformanceReport } from './performance-report.entity/performance-report.entity';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [TypeOrmModule.forFeature([SalesReport, PerformanceReport])]
})
export class ReportsModule {}
