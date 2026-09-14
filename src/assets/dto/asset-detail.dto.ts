import { IsString } from 'class-validator';

export class AssetDetailDto {
  @IsString() ram_type: string;
  @IsString() ram_capacity: string;
  @IsString() hdd_type: string;
  @IsString() hdd_capacity: string;
  @IsString() pro_type: string;
  @IsString() pro_detail: string;
  @IsString() mbr_type: string;
  @IsString() mbr_detail: string;
  @IsString() gra_type: string;
  @IsString() gra_detail: string;
  @IsString() monitor: string;
  @IsString() mon_detail: string;
  @IsString() keyboard: string;
  @IsString() key_detail: string;
  @IsString() mouse: string;
  @IsString() mou_detail: string;
}
