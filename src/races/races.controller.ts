import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { RacesService } from './races.service';
import { FindRacesDto } from './dto/find-races.dto';

@Controller('races')
export class RacesController {
  constructor(private readonly racesService: RacesService) {}

  @Get()
  findAll(@Query() query: FindRacesDto) {
    return this.racesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.racesService.findOne(id);
  }
}