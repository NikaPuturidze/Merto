import { Module } from '@nestjs/common'
import { GetTopicsController } from './get-topics/get-topics.controller'
import { GetTopicsService } from './get-topics/get-topics.service'
import { MegaMenuService } from './mega-menu/mega-menu.service';
import { MegaMenuController } from './mega-menu/mega-menu.controller';

@Module({
  imports: [],
  controllers: [GetTopicsController, MegaMenuController],
  providers: [GetTopicsService, MegaMenuService],
})
export class AppModule {}
