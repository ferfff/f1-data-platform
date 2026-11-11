
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { RaceSessionsService } from './race-sessions.service';
import { FindRaceSessionsDto } from './dto/find-race-sessions.dto';

@Controller('race-sessions')
export class RaceSessionsController {
  constructor(
    private readonly raceSessionsService: RaceSessionsService,
  ) {}

  @Get()
  findAll(@Query() query: FindRaceSessionsDto) {
    return this.raceSessionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.raceSessionsService.findOne(id);
  }
}
