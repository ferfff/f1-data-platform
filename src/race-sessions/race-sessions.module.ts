import { Module } from '@nestjs/common';
import { RaceSessionsController } from './race-sessions.controller';
import { RaceSessionsService } from './race-sessions.service';

@Module({
  controllers: [RaceSessionsController],
  providers: [RaceSessionsService]
})
export class RaceSessionsModule {}
