import { Controller, Get, Query } from '@nestjs/common'
import { DetailService } from './detail.service'

@Controller('details')
export class DetailController {
  constructor(private readonly detailsService: DetailService) {}

  @Get()
  async products(@Query('productId') productId: number) {
    return this.detailsService.getProductDetails(productId)
  }
}
