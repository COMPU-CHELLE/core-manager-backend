import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RequestContext } from '../common/context/request-context';

@Injectable({ scope: Scope.REQUEST })
export class PrismaTenantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly context: RequestContext,
  ) {}

  get companyId(): number | undefined {
    return this.context.companyId ?? undefined;
  }

  get isGlobal(): boolean {
    return Boolean(this.context.isGlobal);
  }

  get tenantWhere(): { companyId?: number } {
    if (this.isGlobal) {
      return {};
    }

    return this.companyId ? { companyId: this.companyId } : {};
  }

  get client(): PrismaService {
    return this.prisma;
  }

  get asset() {
    return this.prisma.asset;
  }

  get user() {
    return this.prisma.user;
  }

  get invoice() {
    return this.prisma.invoice;
  }

  get task() {
    return this.prisma.task;
  }

  get employee() {
    return this.prisma.employee;
  }
}
