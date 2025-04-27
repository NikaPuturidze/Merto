import { Module } from '@nestjs/common'
import { GetTopicsController } from './get-topics/get-topics.controller'
import { GetTopicsService } from './get-topics/get-topics.service'
import { MegaMenuService } from './mega-menu/mega-menu.service'
import { MegaMenuController } from './mega-menu/mega-menu.controller'
import { CatalogController } from './catalog/catalog.controller'
import { CatalogService } from './catalog/catalog.service'

@Module({
  imports: [],
  controllers: [GetTopicsController, MegaMenuController, CatalogController],
  providers: [GetTopicsService, MegaMenuService, CatalogService],
})
export class AppModule {}
