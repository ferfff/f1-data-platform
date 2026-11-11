import { Module } from '@nestjs/common';
import { DriverTeamSeasonsController } from './driver-team-seasons.controller';
import { DriverTeamSeasonsService } from './driver-team-seasons.service';

@Module({
  controllers: [DriverTeamSeasonsController],
  providers: [DriverTeamSeasonsService]
})
export class DriverTeamSeasonsModule {}
