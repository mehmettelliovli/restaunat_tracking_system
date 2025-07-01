import { Module } from '@nestjs/common';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from './table.entity/table.entity';

@Module({
  controllers: [TablesController],
  providers: [TablesService],
  imports: [TypeOrmModule.forFeature([Table])]
})
export class TablesModule {}
