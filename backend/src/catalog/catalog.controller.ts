import { Controller, Get, Query } from '@nestjs/common'
import { CatalogService } from './catalog.service'

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  getTopics(@Query('catId') catId: string): any {
    return this.catalogService.getCatalog(catId)
  }
}
