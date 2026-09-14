import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaTenantService } from './prisma-tenant.service';
import { ContextModule } from 'src/common/context/context.module';

@Module({
  imports: [ContextModule], // 👈 agregar esto
  providers: [PrismaService, PrismaTenantService],
  exports: [PrismaService, PrismaTenantService],
})
export class PrismaModule {}
