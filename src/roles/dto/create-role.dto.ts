import { IsString, IsBoolean, IsOptional, IsInt } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isGlobal?: boolean;

  @IsOptional()
  @IsInt()
  companyId?: number;
}
