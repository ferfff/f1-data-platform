import { Body, Controller, Post } from '@nestjs/common';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { EndpointsService } from './endpoints.service';
import type { Endpoint } from './endpoint.interface';

@Controller('endpoints')
export class EndpointsController {
    constructor(private readonly endpointService: EndpointsService) {}

    @Post()
    createEndpoint(@Body() createEndpointDto: CreateEndpointDto) : Endpoint {
        return this.endpointService.createEndpoint(createEndpointDto);
    }
}
