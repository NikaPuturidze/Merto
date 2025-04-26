import { Controller, Get, Headers } from '@nestjs/common'
import { GetTopicsService } from './get-topics.service'

@Controller('topics')
export class GetTopicsController {
  constructor(private readonly getTopicsSevice: GetTopicsService) {}

  @Get()
  getTopics(@Headers('accept-language') acceptLanguage: string): any {
    return this.getTopicsSevice.getTopics(acceptLanguage)
  }
}
