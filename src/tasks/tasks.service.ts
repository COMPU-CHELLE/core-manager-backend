import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { RequestContext } from 'src/common/context/request-context';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { UpdateTaskDto } from './dto/update-tasks.dto';

@Injectable({ scope: Scope.REQUEST })
export class TasksService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    context: RequestContext,
  ) {
    super(context);
  }

  async findAll() {
    return this.prisma.task.findMany({
      where: this.applyTenantFilter(this.excludeDeleted()),
      include: { company: true, createdBy: true, assignedTo: true },
      orderBy: { id: 'desc' },
    });
  }

  async findDeleted() {
    return this.prisma.task.findMany({
      where: this.applyTenantFilter({ deletedAt: { not: null } }),
      include: { company: true, createdBy: true, assignedTo: true },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findFirst({
      where: this.excludeDeleted({ id }),
    });

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    this.validateTenantAccess(task.companyId);
    return task;
  }

  async create(dto: CreateTaskDto) {
    const companyId = this.resolveCompanyId(dto.companyId);

    if (!companyId) {
      throw new BadRequestException('companyId es requerido');
    }

    if (!this.context.userId) {
      throw new BadRequestException('Usuario autenticado requerido');
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,

        status: 'OPEN',
        companyId,
        createdById: this.context.userId,
      },
    });
  }

  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    this.validateTenantAccess(task.companyId);

    if (task.closedAt) {
      throw new BadRequestException('La tarea ya fue finalizada');
    }

    const isClosing = !!dto.closedAt;

    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority,

        // 🔑 CLAVE
        dueDate: dto.dueDate,

        closedAt: dto.closedAt ? new Date(dto.closedAt) : undefined,
        solution: dto.solution,

        status: isClosing ? 'DONE' : 'IN_PROGRESS',
        assignedToId: this.context.userId,
      },
    });
  }

  async remove(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    this.validateTenantAccess(task.companyId);

    if (task.status !== 'OPEN') {
      throw new BadRequestException(
        'Solo se pueden eliminar tareas en estado OPEN',
      );
    }

    return this.prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async hardRemove(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    this.validateTenantAccess(task.companyId);

    return this.prisma.task.delete({ where: { id } });
  }

  async restore(id: number) {
    const task = await this.prisma.task.findFirst({
      where: { id, deletedAt: { not: null } },
    });

    if (!task) {
      throw new NotFoundException('Tarea eliminada no encontrada');
    }

    this.validateTenantAccess(task.companyId);

    return this.prisma.task.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
