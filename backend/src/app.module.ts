import { Module } from '@nestjs/common'
import { GetTopicsController } from './get-topics/get-topics.controller'
import { GetTopicsService } from './get-topics/get-topics.service'

@Module({
  imports: [],
  controllers: [GetTopicsController],
  providers: [GetTopicsService],
})
export class AppModule {}
