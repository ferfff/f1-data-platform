
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { DriverTeamSeasonsService } from './driver-team-seasons.service';
import { FindDriverTeamSeasonsDto } from './dto/find-driver-team-seasons.dto';

@Controller('driver-team-seasons')
export class DriverTeamSeasonsController {
  constructor(
    private readonly driverTeamSeasonsService: DriverTeamSeasonsService,
  ) {}

  @Get()
  findAll(@Query() query: FindDriverTeamSeasonsDto) {
    return this.driverTeamSeasonsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.driverTeamSeasonsService.findOne(id);
  }
}
