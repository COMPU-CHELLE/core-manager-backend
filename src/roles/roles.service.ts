import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestContext } from '../common/context/request-context';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { BaseService } from '../common/base/base.service';

@Injectable({ scope: Scope.REQUEST })
export class RolesService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    context: RequestContext,
  ) {
    super(context);
  }

  async findAll() {
    if (this.context.isGlobal) {
      return this.prisma.role.findMany({
        where: this.applyTenantFilter(),
        include: { permissions: true },
      });
    }

    return this.prisma.role.findMany({
      where: { companyId: this.context.companyId },
    });
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    });
    if (!role) throw new NotFoundException('Rol no encontrado');

    if (!this.context.isGlobal && role.companyId !== this.context.companyId) {
      throw new NotFoundException('Rol no encontrado');
    }

    return role;
  }

  async create(dto: CreateRoleDto) {
    if (dto.isGlobal && !this.context.isGlobal) {
      throw new NotFoundException('No autorizado');
    }

    return this.prisma.role.create({
      data: {
        ...dto,
        companyId: dto.isGlobal ? null : this.context.companyId,
      },
    });
  }

  async update(id: number, dto: UpdateRoleDto) {
    await this.findOne(id);
    const update = await this.prisma.role.update({
      where: { id },
      data: dto,
    });

    return this.ok(update, 'Rol actualizado correctamente');
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.role.delete({ where: { id } });
  }

  // ===============================
  // 🔐 PERMISSIONS
  // ===============================

  async listPermissions(roleId: number) {
    await this.findOne(roleId);

    return this.prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    });
  }

  // roles.service.ts

  async listAllPermissionsByModule() {
    const permissions = await this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { action: 'asc' }],
    });

    return permissions.reduce(
      (acc, p) => {
        acc[p.module] ??= [];
        acc[p.module].push(p);
        return acc;
      },
      {} as Record<string, any[]>,
    );
  }

  /**
   * 🔁 Reemplaza todos los permisos del rol
   */
  async syncPermissions(roleId: number, permissionIds: number[]) {
    await this.findOne(roleId);

    return this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({
        where: { roleId },
      }),
      this.prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        })),
      }),
    ]);
  }
}
