import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { HttpModule } from '@nestjs/axios';
import { JolpicaClient } from './jolpica.client';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [IngestionService],
  controllers: [IngestionController],
})
export class IngestionModule {}