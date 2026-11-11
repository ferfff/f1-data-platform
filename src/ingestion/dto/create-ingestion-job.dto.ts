import {
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateIngestionJobDto {
  @IsInt()
  @Min(1950)
  initYear: number;

  @IsInt()
  @IsOptional()
  @Min(1950)
  lastYear?: number | null;
}