import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Scope,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestContext } from '../common/context/request-context';
import { BaseService } from '../common/base/base.service';
import { CreateAssetAssignmentDto } from './dto/create-asset-assignment.dto';
import { AssignmentPdfService } from './assignment-pdf.service';

@Injectable({ scope: Scope.REQUEST })
export class AssetAssignmentsService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    context: RequestContext,
    private readonly pdfService: AssignmentPdfService,
  ) {
    super(context);
  }

  async findAll() {
    return this.prisma.assetAssignment.findMany({
      where: {
        asset: this.applyTenantFilter(),
      },
      include: {
        asset: true,
        employee: true,
        document: true, // 👈 importante
      },
      orderBy: { assignedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const assignment = await this.prisma.assetAssignment.findUnique({
      where: { id },
      include: { asset: true, employee: true },
    });

    if (!assignment) {
      throw new NotFoundException('Asignación no encontrada');
    }

    this.validateTenantAccess(assignment.asset.companyId);
    return assignment;
  }

  /**
   * 📌 Asignar activo a empleado + generar PDF
   */
  async assign(dto: CreateAssetAssignmentDto) {
    if (!this.context.companyId) {
      throw new BadRequestException('Empresa no definida');
    }

    const asset = await this.prisma.asset.findUnique({
      where: { id: dto.assetId },
    });

    if (!asset) {
      throw new NotFoundException('Activo no encontrado');
    }

    this.validateTenantAccess(asset.companyId);

    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    this.validateTenantAccess(employee.companyId);

    const activeAssignment = await this.prisma.assetAssignment.findFirst({
      where: {
        assetId: dto.assetId,
        returnedAt: null,
      },
    });

    if (activeAssignment) {
      throw new BadRequestException(
        'El activo ya está asignado a otro empleado',
      );
    }

    const assignment = await this.prisma.assetAssignment.create({
      data: {
        assetId: dto.assetId,
        employeeId: dto.employeeId,
      },
    });

    // 📄 Crear registro del documento
    await this.prisma.assetAssignmentDocument.create({
      data: {
        assignmentId: assignment.id,
        documentNumber: `AA-${assignment.id}-${new Date().getFullYear()}`,
        generatedById: this.context.userId,
      },
    });

    return assignment;
  }

  /**
   * 🔁 Devolver activo
   */
  async returnAsset(id: number, returnedAt?: string) {
    const assignment = await this.findOne(id);

    if (assignment.returnedAt) {
      throw new BadRequestException('El activo ya fue devuelto');
    }

    return this.prisma.assetAssignment.update({
      where: { id },
      data: {
        returnedAt: returnedAt ? new Date(returnedAt) : new Date(),
      },
    });
  }

  async generatePdf(id: number): Promise<Buffer> {
    const assignment = await this.findOne(id);
    return this.pdfService.generate(assignment.id);
  }
}
