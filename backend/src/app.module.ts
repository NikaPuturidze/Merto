import { Module } from '@nestjs/common'
import { GetTopicsController } from './get-topics/get-topics.controller'
import { GetTopicsService } from './get-topics/get-topics.service'
import { MegaMenuService } from './mega-menu/mega-menu.service'
import { MegaMenuController } from './mega-menu/mega-menu.controller'
import { CatalogController } from './catalog/catalog.controller'
import { CatalogService } from './catalog/catalog.service'
import { FilterController } from './filter/filter.controller';
import { FilterService } from './filter/filter.service';

@Module({
  imports: [],
  controllers: [GetTopicsController, MegaMenuController, CatalogController, FilterController],
  providers: [GetTopicsService, MegaMenuService, CatalogService, FilterService],
})
export class AppModule {}
