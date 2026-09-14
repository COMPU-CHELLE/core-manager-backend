import { IsOptional, IsDateString } from 'class-validator';

export class ReturnAssetDto {
  @IsOptional()
  @IsDateString()
  returnedAt?: string;
}
