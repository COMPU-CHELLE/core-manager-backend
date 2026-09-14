import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestContext } from '../common/context/request-context';
import { BaseService } from 'src/common/base/base.service';

@Injectable({ scope: Scope.REQUEST })
export class AuditService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    context: RequestContext,
  ) {
    super(context);
  }

  async log(data: {
    userId?: number;
    companyId?: number | null;
    action: string;
    entity: string;
    entityId?: number;
    method: string;
    path: string;
    ip?: string;
  }): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        action: data.action,
        entity: data.entity,
        entityId: data.entityId ?? null,
        method: data.method,
        path: data.path,
        ip: data.ip ?? null,
        userId: data.userId ?? null,
        companyId: data.companyId ?? null,
      },
    });
  }

  async findAll() {
    // 🌍 Global ve todo
    if (this.context.isGlobal) {
      return this.prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      });
    }

    // 🏢 Empresa normal
    if (!this.context.companyId) {
      return [];
    }

    return this.prisma.auditLog.findMany({
      where: { companyId: this.context.companyId },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
  }

  async findOne(id: number) {
    const audit = await this.prisma.auditLog.findUnique({
      where: { id },
      include: { user: true }, // 🔥 AQUÍ
    });

    if (!audit) {
      throw new NotFoundException('Registro de auditoría no encontrado');
    }

    // 🔐 Validación correcta por empresa
    if (!this.context.isGlobal && audit.companyId !== this.context.companyId) {
      throw new NotFoundException('Registro de auditoría no encontrado');
    }

    return audit;
  }
}
