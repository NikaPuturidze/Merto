import { Controller, Get, Query } from '@nestjs/common'
import { CatalogService } from './catalog.service'

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  getTopics(@Query('catId') catId: string, @Query('page') page?: string, @Query('limit') limit?: string): any {
    return this.catalogService.getCatalog(catId, Number(page), Number(limit))
  }
}
