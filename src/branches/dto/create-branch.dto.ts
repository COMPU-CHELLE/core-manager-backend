import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  companyId?: number;
}
