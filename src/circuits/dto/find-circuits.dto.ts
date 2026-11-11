import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  IsInt,
} from 'class-validator';

export class FindCircuitsDto {
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
