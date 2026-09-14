import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestContext } from '../common/context/request-context';
import { BaseService } from '../common/base/base.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Injectable({ scope: Scope.REQUEST })
export class MaintenancesService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    context: RequestContext,
  ) {
    super(context);
  }

  async findAll() {
    return this.prisma.maintenance.findMany({
      where: this.excludeDeleted({
        asset: this.applyTenantFilter(),
      }),
      include: { asset: true },
      orderBy: { date: 'desc' },
    });
  }

  async findDeleted() {
    return this.prisma.maintenance.findMany({
      where: {
        deletedAt: { not: null },
        asset: this.applyTenantFilter(),
      },
      include: { asset: true },
      orderBy: { deletedAt: 'desc' },
    });
  }

  async findByAsset(assetId: number) {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      throw new NotFoundException('Activo no encontrado');
    }

    this.validateTenantAccess(asset.companyId);

    return this.prisma.maintenance.findMany({
      where: this.excludeDeleted({ assetId }),
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: number) {
    const maintenance = await this.prisma.maintenance.findFirst({
      where: this.excludeDeleted({ id }),
      include: { asset: true },
    });

    if (!maintenance) {
      throw new NotFoundException('Mantenimiento no encontrado');
    }

    this.validateTenantAccess(maintenance.asset.companyId);
    return maintenance;
  }

  async create(dto: CreateMaintenanceDto) {
    const asset = await this.prisma.asset.findUnique({
      where: { id: dto.assetId },
    });

    if (!asset) {
      throw new NotFoundException('Activo no encontrado');
    }

    this.validateTenantAccess(asset.companyId);

    return this.prisma.maintenance.create({
      data: {
        assetId: dto.assetId,
        description: dto.description,
        cost: dto.cost,
        date: dto.date ? new Date(dto.date) : undefined,
      },
    });
  }

  async update(id: number, dto: UpdateMaintenanceDto) {
    await this.findOne(id);

    return this.prisma.maintenance.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.maintenance.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async hardRemove(id: number) {
    await this.findOne(id);

    return this.prisma.maintenance.delete({
      where: { id },
    });
  }

  async restore(id: number) {
    const maintenance = await this.prisma.maintenance.findFirst({
      where: { id, deletedAt: { not: null } },
      include: { asset: true },
    });

    if (!maintenance) {
      throw new NotFoundException('Mantenimiento eliminado no encontrado');
    }

    this.validateTenantAccess(maintenance.asset.companyId);

    return this.prisma.maintenance.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
