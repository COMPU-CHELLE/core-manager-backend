import {
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateMaintenanceDto {
  @IsInt()
  assetId: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsDateString()
  date?: string;
}
