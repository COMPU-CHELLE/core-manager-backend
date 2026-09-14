import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestContext } from '../common/context/request-context';
import { BaseService } from '../common/base/base.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable({ scope: Scope.REQUEST })
export class AssetsService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    context: RequestContext,
  ) {
    super(context);
  }

  async findAll() {
    return this.prisma.asset.findMany({
      where: this.applyTenantFilter(this.excludeDeleted()),
      include: { detail: true, branch: true },
    });
  }

  async findDeleted() {
    return this.prisma.asset.findMany({
      where: this.applyTenantFilter({ deletedAt: { not: null } }),
      include: { detail: true, branch: true },
      orderBy: { deletedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const asset = await this.prisma.asset.findFirst({
      where: this.applyTenantFilter(this.excludeDeleted({ id })),
      include: { detail: true, branch: true },
    });

    if (!asset) {
      throw new NotFoundException('Activo no encontrado');
    }

    return asset;
  }

  async create(dto: CreateAssetDto) {
    return this.prisma.asset.create({
      data: {
        name: dto.name,
        type: dto.type,
        serial: dto.serial,
        brand: dto.brand,
        model: dto.model,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
        cost: dto.cost,
        branchId: dto.branchId,
        companyId: this.context.companyId!,
        detail: dto.detail
          ? {
              create: dto.detail,
            }
          : undefined,
      },
      include: { detail: true },
    });
  }

  async update(id: number, dto: UpdateAssetDto) {
    await this.findOne(id);

    return this.prisma.asset.update({
      where: { id },
      data: {
        ...dto,
        detail: dto.detail
          ? {
              upsert: {
                create: dto.detail,
                update: dto.detail,
              },
            }
          : undefined,
      },
      include: { detail: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.asset.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async hardRemove(id: number) {
    await this.findOne(id);

    return this.prisma.asset.delete({
      where: { id },
    });
  }

  async restore(id: number) {
    const asset = await this.prisma.asset.findFirst({
      where: this.applyTenantFilter({ id, deletedAt: { not: null } }),
    });

    if (!asset) {
      throw new NotFoundException('Activo eliminado no encontrado');
    }

    return this.prisma.asset.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
