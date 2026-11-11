import { IsString, IsUrl, IsBoolean, IsOptional } from 'class-validator';

export class CreateEndpointDto {
    @IsString()
    name: string;

    @IsUrl()
    url: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}