import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ResultsService } from './results.service';
import { FindResultsDto } from './dto/find-results.dto';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  findAll(@Query() query: FindResultsDto) {
    return this.resultsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.resultsService.findOne(id);
  }
}