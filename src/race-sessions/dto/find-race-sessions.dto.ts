import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { SessionType } from '../../generated/prisma/enums';

export class FindRaceSessionsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  raceId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1950)
  season?: number;

  @IsOptional()
  @IsEnum(SessionType)
  type?: SessionType;

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
