import { IsString } from 'class-validator';

export class CreateTicketMessageDto {
  @IsString()
  message: string;
}
