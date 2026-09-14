import { IsString, IsInt, IsNumber } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsInt()
  maxUsers: number;

  @IsInt()
  maxAssets: number;
}
