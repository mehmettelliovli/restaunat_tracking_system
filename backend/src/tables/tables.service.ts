import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table, TableStatus } from './table.entity/table.entity';

export class CreateTableDto {
  tableNumber: number;
  capacity: number;
  location?: string;
}

export class UpdateTableDto {
  tableNumber?: number;
  capacity?: number;
  status?: TableStatus;
  location?: string;
}

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
  ) {}

  async findAll(): Promise<Table[]> {
    return this.tablesRepository.find({
      order: { tableNumber: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Table> {
    const table = await this.tablesRepository.findOne({ where: { id } });
    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }
    return table;
  }

  async findByStatus(status: TableStatus): Promise<Table[]> {
    return this.tablesRepository.find({ where: { status } });
  }

  async create(createTableDto: CreateTableDto): Promise<Table> {
    const table = this.tablesRepository.create(createTableDto);
    return this.tablesRepository.save(table);
  }

  async update(id: number, updateTableDto: UpdateTableDto): Promise<Table> {
    const table = await this.findOne(id);
    Object.assign(table, updateTableDto);
    return this.tablesRepository.save(table);
  }

  async remove(id: number): Promise<void> {
    const table = await this.findOne(id);
    await this.tablesRepository.remove(table);
  }

  async openTable(id: number): Promise<Table> {
    const table = await this.findOne(id);
    if (table.status !== TableStatus.AVAILABLE) {
      throw new Error('Table is not available');
    }
    table.status = TableStatus.OCCUPIED;
    return this.tablesRepository.save(table);
  }

  async closeTable(id: number): Promise<Table> {
    const table = await this.findOne(id);
    table.status = TableStatus.AVAILABLE;
    return this.tablesRepository.save(table);
  }

  async reserveTable(id: number): Promise<Table> {
    const table = await this.findOne(id);
    if (table.status !== TableStatus.AVAILABLE) {
      throw new Error('Table is not available');
    }
    table.status = TableStatus.RESERVED;
    return this.tablesRepository.save(table);
  }
}
