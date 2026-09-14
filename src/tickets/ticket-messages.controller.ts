import {
  Controller,
  Post,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from '../common/permissions/permissions.decorator';
import { PermissionsGuard } from '../common/permissions/permissions.guard';
import { TicketMessagesService } from './ticket-messages.service';
import { CreateTicketMessageDto } from './dto/create-ticket-message.dto';

@Controller('tickets/:ticketId/messages')
@UseGuards(PermissionsGuard)
export class TicketMessagesController {
  constructor(private readonly service: TicketMessagesService) {}

  @Permissions('tickets.reply')
  @Post()
  create(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() dto: CreateTicketMessageDto,
  ) {
    return this.service.create(ticketId, dto);
  }
}
