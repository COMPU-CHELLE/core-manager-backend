import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContextModule } from '../common/context/context.module';
import { TicketsController } from './tickets.controller';
import { TicketMessagesController } from './ticket-messages.controller';
import { TicketsService } from './tickets.service';
import { TicketMessagesService } from './ticket-messages.service';

@Module({
  imports: [PrismaModule, ContextModule],
  controllers: [TicketsController, TicketMessagesController],
  providers: [TicketsService, TicketMessagesService],
})
export class TicketsModule {}
