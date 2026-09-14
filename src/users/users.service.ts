import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestContext } from '../common/context/request-context';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { BaseService } from '../common/base/base.service';

@Injectable({ scope: Scope.REQUEST })
export class UsersService extends BaseService {
  constructor(
    private prisma: PrismaService,
    context: RequestContext,
  ) {
    super(context);
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: this.applyTenantFilter(),
      include: { role: true, branch: true },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true, branch: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    this.validateTenantAccess(user.companyId);
    return user;
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        companyId: this.context.isGlobal
          ? (dto.companyId ?? null)
          : this.context.companyId,
      },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
