import { Controller, Get, Headers } from '@nestjs/common'
import { MegaMenuService } from './mega-menu.service'

@Controller('mega-menu')
export class MegaMenuController {
  constructor(private readonly megaMenuService: MegaMenuService) {}

  @Get()
  getMegaMenu(@Headers('accept-language') acceptlanguage: string) {
    return this.megaMenuService.getMegaMenu(acceptlanguage)
  }
}
