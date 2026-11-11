import { 
    Controller, 
    Get,
    Param,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { FindDriversDto } from './dto/find-drivers.dto';

@Controller('drivers')
export class DriversController {
    constructor(private readonly driversService: DriversService) {}

    @Get()
    findAll(@Query() query: FindDriversDto) {
        return this.driversService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.driversService.findOne(id);
    }
}
