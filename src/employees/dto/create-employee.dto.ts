import { IsString, IsOptional, IsInt, IsEmail } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsInt()
  branchId?: number;
}
