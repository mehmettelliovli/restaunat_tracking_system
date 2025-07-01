import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './inventory-item.entity/inventory-item.entity';
import { Ingredient } from './ingredient.entity/ingredient.entity';

export class CreateInventoryItemDto {
  name: string;
  description?: string;
  currentStock: number;
  minimumStock: number;
  unitPrice: number;
  unit?: string;
  supplier?: string;
}

export class UpdateInventoryItemDto {
  name?: string;
  description?: string;
  currentStock?: number;
  minimumStock?: number;
  unitPrice?: number;
  unit?: string;
  supplier?: string;
  isActive?: boolean;
}

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  async findAll(): Promise<InventoryItem[]> {
    return this.inventoryItemRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<InventoryItem> {
    const item = await this.inventoryItemRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
    return item;
  }

  async findLowStock(): Promise<InventoryItem[]> {
    return this.inventoryItemRepository
      .createQueryBuilder('item')
      .where('item.currentStock <= item.minimumStock')
      .andWhere('item.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async create(createInventoryItemDto: CreateInventoryItemDto): Promise<InventoryItem> {
    const item = this.inventoryItemRepository.create(createInventoryItemDto);
    return this.inventoryItemRepository.save(item);
  }

  async update(id: number, updateInventoryItemDto: UpdateInventoryItemDto): Promise<InventoryItem> {
    const item = await this.findOne(id);
    Object.assign(item, updateInventoryItemDto);
    return this.inventoryItemRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.inventoryItemRepository.remove(item);
  }

  async updateStock(id: number, quantity: number): Promise<InventoryItem> {
    const item = await this.findOne(id);
    item.currentStock += quantity;
    return this.inventoryItemRepository.save(item);
  }
}
