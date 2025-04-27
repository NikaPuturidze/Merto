import { Controller, Get, Headers, Query } from '@nestjs/common'
import { FilterService } from './filter.service'

@Controller()
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  @Get('/filter')
  async filter(@Headers('accept-language') acceptlanguage: string, @Query('catId') category: string) {
    return this.filterService.getFilter(acceptlanguage, category)
  }
}
