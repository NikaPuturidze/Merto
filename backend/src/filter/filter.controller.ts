import { Controller, Get, Query } from '@nestjs/common'
import { FilterService } from './filter.service'

@Controller()
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  @Get('/filter')
  async filter(@Query('catId') catId: number, @Query('page') page?: string, @Query('limit') limit?: string) {
    if (!catId) {
      throw new Error('categoryId is required')
    }
    return this.filterService.getFilter(Number(catId), Number(page), Number(limit))
  }
}
