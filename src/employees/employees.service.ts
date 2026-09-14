import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestContext } from '../common/context/request-context';
import { BaseService } from '../common/base/base.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable({ scope: Scope.REQUEST })
export class EmployeesService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    context: RequestContext,
  ) {
    super(context);
  }

  async findAll() {
    return this.prisma.employee.findMany({
      where: this.applyTenantFilter(this.excludeDeleted()),
      include: {
        company: true,
        branch: true,
        _count: {
          select: {
            assignments: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findDeleted() {
    return this.prisma.employee.findMany({
      where: this.applyTenantFilter({ deletedAt: { not: null } }),
      include: { company: true, branch: true },
      orderBy: { deletedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const employee = await this.prisma.employee.findFirst({
      where: this.applyTenantFilter(this.excludeDeleted({ id })),
      include: { company: true, branch: true },
    });

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    return employee;
  }

  async create(dto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: {
        ...dto,
        companyId: this.context.companyId!,
      },
    });
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    await this.findOne(id);

    return this.prisma.employee.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.employee.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async hardRemove(id: number) {
    await this.findOne(id);

    return this.prisma.employee.delete({
      where: { id },
    });
  }

  async restore(id: number) {
    const employee = await this.prisma.employee.findFirst({
      where: this.applyTenantFilter({ id, deletedAt: { not: null } }),
    });

    if (!employee) {
      throw new NotFoundException('Empleado eliminado no encontrado');
    }

    return this.prisma.employee.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
