import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ConstructorsService } from './constructors.service';
import { FindConstructorsDto } from './dto/find-constructors.dto';

@Controller('constructors')
export class ConstructorsController {
    constructor(private readonly constructorsService: ConstructorsService) {}

    @Get()
    findAll(@Query() query: FindConstructorsDto) {
        return this.constructorsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.constructorsService.findOne(id);
    }
}
