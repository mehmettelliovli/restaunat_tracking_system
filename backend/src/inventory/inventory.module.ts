import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItem } from './inventory-item.entity/inventory-item.entity';
import { Ingredient } from './ingredient.entity/ingredient.entity';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService],
  imports: [TypeOrmModule.forFeature([InventoryItem, Ingredient])]
})
export class InventoryModule {}
