import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class DashboardFilterDto {
  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;
}
