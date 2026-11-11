import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: 'OK',
      database: 'CONNECTED',
      service: 'f1-data-platform',
      timestamp: new Date().toISOString(),
    };
  }
}