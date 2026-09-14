import { IsString, IsOptional, IsIn, IsInt } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  title: string;

  @IsString()
  @IsIn(['OPEN', 'IN_PROGRESS', 'CLOSED'])
  @IsOptional()
  status?: string; // por defecto OPEN

  @IsString()
  message: string;

  @IsOptional()
  @IsInt()
  companyId?: number;
}
