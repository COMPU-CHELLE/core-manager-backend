import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';

@Injectable()
export class AssignmentPdfService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(assignmentId: number): Promise<Buffer> {
    const assignment = await this.prisma.assetAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        asset: true,
        employee: true,
        document: true,
      },
    });

    if (!assignment || !assignment.document) {
      throw new NotFoundException('Documento no encontrado');
    }

    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));

    doc.fontSize(18).text('ACTA DE ASIGNACIÓN DE EQUIPO', {
      align: 'center',
    });

    doc.moveDown();
    doc.fontSize(12).text(`Documento: ${assignment.document.documentNumber}`);
    doc.text(`Fecha: ${assignment.document.generatedAt.toLocaleDateString()}`);

    doc.moveDown();
    doc.text(`Empleado: ${assignment.employee.name}`);
    doc.text(`Cargo: ${assignment.employee.position ?? 'N/A'}`);

    doc.moveDown();
    doc.text(`Equipo: ${assignment.asset.name}`);
    doc.text(`Serial: ${assignment.asset.serial ?? 'N/A'}`);

    doc.end();

    await new Promise<void>((resolve) => {
      doc.on('end', () => resolve());
    });

    return Buffer.concat(buffers);
  }
}
