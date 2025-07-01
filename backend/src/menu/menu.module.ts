import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuItem } from './menu-item.entity/menu-item.entity';
import { Category } from './category.entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem, Category])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService]
})
export class MenuModule {}
