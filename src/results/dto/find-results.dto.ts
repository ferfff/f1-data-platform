import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { SessionType } from '../../generated/prisma/enums';

export class FindResultsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1950)
  season?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  raceId?: number;

  @IsOptional()
  @IsEnum(SessionType)
  sessionType?: SessionType;

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
  @IsString()
  @MaxLength(100)
  search?: string;

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