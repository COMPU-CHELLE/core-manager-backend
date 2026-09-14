import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestContext } from '../common/context/request-context';
import { BaseService } from '../common/base/base.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable({ scope: Scope.REQUEST })
export class InvoicesService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    context: RequestContext,
  ) {
    super(context);
  }

  async findAll() {
    return this.prisma.invoice.findMany({
      where: this.applyTenantFilter(this.excludeDeleted()),
      include: { items: true, company: true, branch: true },
      orderBy: { date: 'desc' },
    });
  }

  async findDeleted() {
    return this.prisma.invoice.findMany({
      where: this.applyTenantFilter({ deletedAt: { not: null } }),
      include: { items: true, company: true, branch: true },
      orderBy: { deletedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const invoice = await this.prisma.invoice.findFirst({
      where: this.excludeDeleted({ id }),
      include: { items: true, company: true, branch: true },
    });

    if (!invoice) {
      throw new NotFoundException('Factura no encontrada');
    }

    this.validateTenantAccess(invoice.companyId);
    return invoice;
  }

  async create(dto: CreateInvoiceDto) {
    const companyId = this.resolveCompanyId(dto.companyId);

    if (!companyId) {
      throw new BadRequestException('companyId es requerido');
    }

    if (!dto.branchId) {
      throw new BadRequestException('branchId es requerido');
    }

    const items = dto.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      tax: item.tax ?? 0,
      total: item.total ?? 0,
    }));

    return this.prisma.invoice.create({
      data: {
        number: dto.number,
        provider: dto.provider,
        category: dto.category,
        date: new Date(dto.date),
        companyId,
        branchId: dto.branchId, // ✅ number garantizado
        items: {
          create: items,
        },
      },
      include: { items: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.invoice.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async hardRemove(id: number) {
    await this.findOne(id);

    return this.prisma.invoice.delete({
      where: { id },
    });
  }

  async restore(id: number) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, deletedAt: { not: null } },
    });

    if (!invoice) {
      throw new NotFoundException('Factura eliminada no encontrada');
    }

    this.validateTenantAccess(invoice.companyId);

    return this.prisma.invoice.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
