import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestContext } from '../common/context/request-context';
import { CreateTicketMessageDto } from './dto/create-ticket-message.dto';

@Injectable({ scope: Scope.REQUEST })
export class TicketMessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly context: RequestContext,
  ) {}

  async create(ticketId: number, dto: CreateTicketMessageDto) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }

    if (ticket.companyId !== this.context.companyId) {
      throw new NotFoundException('Ticket no encontrado');
    }

    return this.prisma.ticketMessage.create({
      data: {
        message: dto.message,
        ticketId,
        userId: this.context.userId!,
      },
    });
  }
}
