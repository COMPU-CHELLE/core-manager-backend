import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestContext } from '../common/context/request-context';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { BaseService } from 'src/common/base/base.service';

@Injectable({ scope: Scope.REQUEST })
export class PlansService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    context: RequestContext,
  ) {
    super(context);
  }

  async findAll() {
    const plans = await this.prisma.plan.findMany();
    return this.raw(plans);
  }

  async findOne(id: number) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plan no encontrado');

    return this.raw(plan);
  }

  async create(dto: CreatePlanDto) {
    const plan = await this.prisma.plan.create({ data: dto });

    return this.ok(plan, 'Plan creado correctamente');
  }

  async update(id: number, dto: UpdatePlanDto) {
    await this.findOne(id);
    const plan = await this.prisma.plan.update({ where: { id }, data: dto });
    return this.ok(plan, 'Plan actualizado correctamente');
  }

  async remove(id: number) {
    await this.findOne(id);
    const plan = await this.prisma.plan.delete({ where: { id } });
    return this.info(plan, 'Plan eliminado correctamente');
  }
}
