import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  checkHealth() {
    return this.appService.getHealth();
  }
  /*getHello(): string {
    return this.appService.getHello();
  }*/
}
