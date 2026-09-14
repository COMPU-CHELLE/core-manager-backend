import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsInt()
  roleId: number;

  @IsOptional()
  @IsInt()
  companyId?: number;

  @IsOptional()
  @IsInt()
  branchId?: number;
}
