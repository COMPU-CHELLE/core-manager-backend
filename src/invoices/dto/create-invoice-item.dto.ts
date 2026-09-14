import { IsString, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateInvoiceItemDto {
  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?: number;

  @IsNumber()
  total: number;
}
