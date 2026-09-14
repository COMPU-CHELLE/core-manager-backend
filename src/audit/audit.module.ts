import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';
import { PrismaModule } from '../prisma/prisma.module';
import { ContextModule } from '../common/context/context.module';
import { AuditController } from './audit.controller';

@Module({
  imports: [PrismaModule, ContextModule],
  controllers: [AuditController],
  providers: [AuditService, AuditInterceptor],
  exports: [AuditService, AuditInterceptor],
})
export class AuditModule {}
