import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nit?: string;

  @IsOptional()
  @IsString()
  logo?: string; // ✅

  @IsInt()
  planId: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
