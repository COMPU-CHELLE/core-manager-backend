import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestContext } from '../common/context/request-context';
import { BaseService } from '../common/base/base.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable({ scope: Scope.REQUEST })
export class TicketsService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    context: RequestContext,
  ) {
    super(context);
  }

  async findAll() {
    return this.prisma.ticket.findMany({
      where: this.applyTenantFilter(this.excludeDeleted()),
      include: {
        company: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  async findDeleted() {
    return this.prisma.ticket.findMany({
      where: this.applyTenantFilter({ deletedAt: { not: null } }),
      include: { company: true },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const ticket = await this.prisma.ticket.findFirst({
      where: this.excludeDeleted({ id }),
      include: {
        company: true,
        messages: {
          include: { user: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }

    this.validateTenantAccess(ticket.companyId);
    return ticket;
  }

  async create(dto: CreateTicketDto) {
    const companyId = this.resolveCompanyId(dto.companyId);
    const userId = this.context.userId;

    if (!companyId) {
      throw new BadRequestException('companyId es requerido');
    }

    if (!userId) {
      throw new BadRequestException('Usuario no autenticado');
    }

    return this.prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.create({
        data: {
          title: dto.title,
          status: 'OPEN',
          companyId,
        },
      });

      await tx.ticketMessage.create({
        data: {
          ticketId: ticket.id,
          message: dto.message,
          userId,
        },
      });
      return ticket;
    });
  }

  async update(id: number, dto: UpdateTicketDto) {
    await this.findOne(id);

    return this.prisma.ticket.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.ticket.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async hardRemove(id: number) {
    await this.findOne(id);

    return this.prisma.ticket.delete({
      where: { id },
    });
  }

  async restore(id: number) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id, deletedAt: { not: null } },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket eliminado no encontrado');
    }

    this.validateTenantAccess(ticket.companyId);

    return this.prisma.ticket.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
