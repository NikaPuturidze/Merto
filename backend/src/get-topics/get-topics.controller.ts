import { Controller, Get } from '@nestjs/common'
import { GetTopicsService } from './get-topics.service'

@Controller('get-topics')
export class GetTopicsController {
  constructor(private readonly getTopicsSevice: GetTopicsService) {}

  @Get()
  getTopics(): string {
    return this.getTopics()
  }
}
