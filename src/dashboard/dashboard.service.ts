import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestContext } from '../common/context/request-context';
import { BaseService } from '../common/base/base.service';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';

@Injectable({ scope: Scope.REQUEST })
export class DashboardService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    context: RequestContext,
  ) {
    super(context);
  }

  // =============================
  // 🔢 OVERVIEW KPIs
  // =============================
  async overview() {
    const filter = this.applyTenantFilter();

    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );

    const [
      users,
      assets,
      assignedAssets,
      employees,
      openTickets,
      maintenancesThisMonth,
      maintenanceCost,
    ] = await Promise.all([
      this.prisma.user.count({ where: filter }),

      this.prisma.asset.count({ where: filter }),

      this.prisma.assetAssignment.count({
        where: {
          returnedAt: null,
          asset: filter,
        },
      }),

      this.prisma.employee.count({ where: filter }),

      this.prisma.ticket.count({
        where: { ...filter, status: 'OPEN' },
      }),

      this.prisma.maintenance.count({
        where: {
          asset: filter,
          date: { gte: firstDayOfMonth },
        },
      }),

      this.prisma.maintenance.aggregate({
        _sum: { cost: true },
        where: {
          asset: filter,
          date: { gte: firstDayOfMonth },
        },
      }),
    ]);

    return {
      users,
      assets,
      assignedAssets,
      availableAssets: assets - assignedAssets,
      employees,
      openTickets,
      maintenancesThisMonth,
      maintenanceCost: maintenanceCost._sum.cost ?? 0,
    };
  }

  // =============================
  // 📊 CHARTS (original)
  // =============================
  async charts(filters: DashboardFilterDto) {
    const year = filters.year ?? new Date().getFullYear();
    const filter = this.applyTenantFilter();

    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);

    const assetsByYear = await this.prisma.asset.count({
      where: {
        ...filter,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const ticketsByStatus = await this.prisma.ticket.groupBy({
      by: ['status'],
      where: filter,
      _count: { _all: true },
    });

    const maintenancesByDate = await this.prisma.maintenance.groupBy({
      by: ['date'],
      where: {
        asset: filter,
      },
      _count: { _all: true },
    });

    return {
      assetsByYear,
      ticketsByStatus,
      maintenancesByDate,
    };
  }

  // =============================
  // 🧾 RECENT DATA (original)
  // =============================
  async recent() {
    const filter = this.applyTenantFilter();

    const [assets, tickets, maintenances] = await Promise.all([
      this.prisma.asset.findMany({
        where: filter,
        orderBy: { id: 'desc' },
        take: 5,
      }),

      this.prisma.ticket.findMany({
        where: filter,
        orderBy: { id: 'desc' },
        take: 5,
      }),

      this.prisma.maintenance.findMany({
        where: {
          asset: filter,
        },
        orderBy: { id: 'desc' },
        take: 5,
        include: { asset: true },
      }),
    ]);

    return { assets, tickets, maintenances };
  }

  // =============================
  // 👑 SUPER ADMIN (original)
  // =============================
  async superAdmin() {
    if (!this.context.isGlobal || this.context.companyId !== null) {
      return null;
    }

    const companies = await this.prisma.company.findMany({
      include: {
        plan: true,
        _count: {
          select: {
            users: true,
            assets: true,
          },
        },
        invoices: {
          include: {
            items: true,
          },
        },
      },
    });

    return companies.map((c) => {
      const invoiceTotal = c.invoices.reduce((sum, inv) => {
        return sum + inv.items.reduce((s, i) => s + i.total, 0);
      }, 0);

      return {
        id: c.id,
        name: c.name,
        users: c._count.users,
        assets: c._count.assets,
        isActive: c.isActive,
        plan: {
          name: c.plan.name,
          price: c.plan.price,
        },
        billingTotal: invoiceTotal,
      };
    });
  }

  // =============================
  // 💰 NUEVO: BILLING CHARTS
  // =============================
  async billingCharts(year?: number) {
    const selectedYear = year ?? new Date().getFullYear();
    const filter = this.applyTenantFilter();

    const start = new Date(selectedYear, 0, 1);
    const end = new Date(selectedYear, 11, 31);

    const invoices = await this.prisma.invoice.findMany({
      where: {
        ...filter,
        date: { gte: start, lte: end },
      },
      include: {
        items: true,
        company: true,
        branch: true,
      },
    });

    // 🔹 Línea global
    const companyMonthly: number[] = Array<number>(12).fill(0);

    // 🔹 Por sede (YA EXISTENTE)
    const branchMonthly: Record<string, number[]> = {};

    // 🔹 NUEVO: por empresa
    const companyByCompanyMonthly: Record<string, number[]> = {};

    for (const inv of invoices) {
      const month = new Date(inv.date).getMonth();
      const total = inv.items.reduce((s, i) => s + i.total, 0);

      // Global
      companyMonthly[month] += total;

      // Por sede
      if (!branchMonthly[inv.branch.name]) {
        branchMonthly[inv.branch.name] = Array<number>(12).fill(0);
      }
      branchMonthly[inv.branch.name][month] += total;

      // 🔥 Por empresa
      if (!companyByCompanyMonthly[inv.company.name]) {
        companyByCompanyMonthly[inv.company.name] = Array<number>(12).fill(0);
      }
      companyByCompanyMonthly[inv.company.name][month] += total;
    }

    return {
      companyMonthly,
      branchMonthly,
      companyByCompanyMonthly,
    };
  }
}
