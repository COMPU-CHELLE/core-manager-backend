import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestContext } from '../common/context/request-context';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { BaseService } from '../common/base/base.service';

@Injectable({ scope: Scope.REQUEST })
export class CompaniesService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    context: RequestContext,
  ) {
    super(context);
  }

  async findAll() {
    const companies = await this.prisma.company.findMany({
      where: this.applyCompanyFilter(),
      include: {
        _count: {
          select: {
            branches: true,
            employees: true,
            assets: true,
          },
        },
      },
    });

    return this.raw(companies);
  }

  async findOne(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Sucursal no encontrada');
    }

    this.validateTenantAccess(company.id);
    return this.raw(company);
  }

  /**
   * 🔐 Crear empresas SOLO permitido a SUPER_ADMIN
   */
  async create(dto: CreateCompanyDto) {
    if (!this.context.isGlobal) {
      throw new NotFoundException('No autorizado');
    }

    const company = await this.prisma.company.create({
      data: dto,
    });

    return this.ok(company, 'Empresa creada correctamente');
  }

  async update(id: number, dto: UpdateCompanyDto) {
    await this.findOne(id);

    const updated = await this.prisma.company.update({
      where: { id },
      data: dto,
    });

    return this.ok(updated, 'Empresa actualizada correctamente');
  }

  uploadLogo(file: Express.Multer.File): { url: string } {
    if (!file) {
      throw new Error('Archivo requerido');
    }

    return {
      url: `/uploads/companies/${file.filename}`,
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    const company = await this.prisma.company.delete({
      where: { id },
    });

    return this.info(company, 'Empresa eliminada correctamente');
  }
}
