import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { BaseService } from '../common/base/base.service';
import { RequestContext } from '../common/context/request-context';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable({ scope: Scope.REQUEST })
export class BranchesService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    context: RequestContext,
  ) {
    super(context);
  }

  async findAll() {
    return this.prisma.branch.findMany({
      where: this.applyTenantFilter(this.excludeDeleted()),
      include: { employees: true, assets: true },
    });
  }

  async findDeleted() {
    return this.prisma.branch.findMany({
      where: this.applyTenantFilter({ deletedAt: { not: null } }),
      include: { employees: true, assets: true },
      orderBy: { deletedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const branch = await this.prisma.branch.findFirst({
      where: this.excludeDeleted({ id }),
    });

    if (!branch) {
      throw new NotFoundException('Sucursal no encontrada');
    }

    this.validateTenantAccess(branch.companyId);
    return branch;
  }

  async create(dto: CreateBranchDto) {
    const companyId = this.resolveCompanyId(dto.companyId);

    if (!companyId) {
      throw new BadRequestException('companyId es requerido');
    }

    return this.prisma.branch.create({
      data: {
        ...dto,
        companyId,
      },
    });
  }
  async update(id: number, dto: UpdateBranchDto) {
    await this.findOne(id);

    return this.prisma.branch.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.branch.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async hardRemove(id: number) {
    await this.findOne(id);

    return this.prisma.branch.delete({
      where: { id },
    });
  }

  async restore(id: number) {
    const branch = await this.prisma.branch.findFirst({
      where: { id, deletedAt: { not: null } },
    });

    if (!branch) {
      throw new NotFoundException('Sucursal eliminada no encontrada');
    }

    this.validateTenantAccess(branch.companyId);

    return this.prisma.branch.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
