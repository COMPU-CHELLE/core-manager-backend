import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContextModule } from '../common/context/context.module';
import { AssetAssignmentsController } from './asset-assignments.controller';
import { AssetAssignmentsService } from './asset-assignments.service';
import { AssignmentPdfService } from './assignment-pdf.service';

@Module({
  imports: [PrismaModule, ContextModule],
  controllers: [AssetAssignmentsController],
  providers: [AssetAssignmentsService, AssignmentPdfService],
})
export class AssetAssignmentsModule {}
