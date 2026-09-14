import { IsInt } from 'class-validator';

export class CreateAssetAssignmentDto {
  @IsInt()
  assetId: number;

  @IsInt()
  employeeId: number;
}
