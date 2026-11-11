import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'OK',
      service: 'f1-data-platform',
      timestamp: new Date().toISOString(),
    };
  }
}
