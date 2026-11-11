import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CircuitsService } from './circuits.service';
import { FindCircuitsDto } from './dto/find-circuits.dto';

@Controller('circuits')
export class CircuitsController {
  constructor(private readonly circuitsService: CircuitsService) {}

  @Get()
  findAll(@Query() query: FindCircuitsDto) {
    return this.circuitsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.circuitsService.findOne(id);
  }
}
