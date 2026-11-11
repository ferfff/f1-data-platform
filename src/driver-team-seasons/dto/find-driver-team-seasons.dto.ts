
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class FindDriverTeamSeasonsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1950)
  season?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  driverId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  constructorId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99)
  number?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
