import { IsInt, IsOptional, ValidateIf } from 'class-validator';

export class SwitchCompanyDto {
  @ValidateIf((o: SwitchCompanyDto) => o.companyId !== null)
  @IsInt()
  @IsOptional()
  companyId: number | null;
}
