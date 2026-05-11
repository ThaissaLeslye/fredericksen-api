import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Retorna uma mensagem de saudação' })
  @ApiOkResponse({ description: 'Mensagem de boas-vindas da API.' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
