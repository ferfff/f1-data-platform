import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { FindSeasonsDto } from './dto/find-seasons.dto';

@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Get()
  findAll(@Query() query: FindSeasonsDto) {
    return this.seasonsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.seasonsService.findOne(id);
  }
}