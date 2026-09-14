import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AssetDetailDto } from './asset-detail.dto';

export class CreateAssetDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  serial?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsInt()
  branchId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => AssetDetailDto)
  detail?: AssetDetailDto;
}
