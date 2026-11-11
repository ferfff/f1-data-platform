import { Injectable } from '@nestjs/common';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { Endpoint } from './endpoint.interface';

@Injectable()
export class EndpointsService {
    static nextId = 1;

    createEndpoint(createEndpointDto: CreateEndpointDto) : Endpoint {
        // Logic to create a new endpoint
        return {
            id: EndpointsService.nextId++,
            name: createEndpointDto.name,
            url: createEndpointDto.url,
            isActive: createEndpointDto.isActive ?? true
        };
    }
}
