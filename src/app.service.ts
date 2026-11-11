import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'OK',
      service: 'webhook-hub',
      timestamp: new Date().toISOString(),
    };
  }
}
